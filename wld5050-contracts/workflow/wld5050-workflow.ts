/**
 * WLD5050 CRE Workflow — v2 (Option B dual token: USDC + WLD)
 * Simulate: cre workflow simulate --workflow workflow/wld5050-workflow.ts
 */
import { ethers } from "ethers"

const WLD5050_CONTRACT      = "{{.WLD5050_CONTRACT_ADDRESS}}"
const AGENTKIT_ENDPOINT     = "https://wld5050.com/trigger-draw"
const CONFIDENTIAL_AI_URL   = "{{.CHAINLINK_CONFIDENTIAL_AI_URL}}"
const CONFIDENTIAL_AI_KEY   = "{{.CHAINLINK_CONFIDENTIAL_AI_KEY}}"
const WORLD_CHAIN_ID        = 480

// Token labels for logging
const TOKEN_LABELS = ["USDC", "WLD"]

// Ticket prices (mirrors contract constants — keep in sync)
const TICKET_PRICE = {
  USDC: 2_500_000n,               // $2.50 USDC (6 decimals)
  WLD:  2_500_000_000_000_000_000n // 2.50 WLD  (18 decimals)
}

interface RaffleState {
  raffleId:     number
  creator:      string
  token:        number   // 0=USDC 1=WLD
  ticketsSold:  number
  ticketPrice:  bigint
  endTime:      number
  totalRevenue: bigint
  isEnded:      boolean
  status:       number
}

export default async function workflow(config: Record<string, unknown>, runtime: any) {
  runtime.log("WLD5050 CRE workflow v2 (USDC + WLD) started")

  // ── Step 1: Get all expired raffles ──────────────────────────────────────
  const expiredIds: number[] = await runtime.evmClient.read({
    chainId: WORLD_CHAIN_ID, address: WLD5050_CONTRACT,
    function: "getExpiredRaffles", args: [], abi: WLD5050_ABI,
  })

  runtime.log(`Expired raffles: ${expiredIds.length}`)
  if (!expiredIds.length) return

  // ── Step 2: Process each expired raffle ──────────────────────────────────
  for (const raffleId of expiredIds) {
    const raffle = await readRaffleState(runtime, raffleId)
    const tokenLabel = TOKEN_LABELS[raffle.token] ?? "UNKNOWN"

    runtime.log(`Raffle #${raffleId} | token: ${tokenLabel} | tickets: ${raffle.ticketsSold}`)

    // ── Branch A: 0 tickets → expire ──────────────────────────────────────
    if (raffle.ticketsSold === 0) {
      runtime.log(`Raffle #${raffleId}: 0 tickets — expiring`)
      await runtime.evmClient.write({
        chainId: WORLD_CHAIN_ID, address: WLD5050_CONTRACT,
        function: "onReport",
        args: [WORKFLOW_METADATA, encodeReport(raffleId, 0, ethers.ZeroHash)],
        abi: WLD5050_ABI,
      })
      continue
    }

    // ── Branch B: 1+ tickets → full settlement ────────────────────────────

    // AgentKit: verify human-backed draw agent
    const auth = await runtime.fetch(AGENTKIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raffleId, creator: raffle.creator, token: tokenLabel }),
    })
    if (!auth.ok) {
      runtime.log(`Raffle #${raffleId}: AgentKit rejected — skipping`)
      continue
    }
    runtime.log(`Raffle #${raffleId}: AgentKit ✓`)

    // Confidential AI: fairness attestation inside TEE
    let aiHash = ethers.ZeroHash
    try {
      const aiRes = await runtime.confidentialHttp.request({
        url: CONFIDENTIAL_AI_URL, method: "POST",
        headers: {
          "Authorization": `Bearer ${CONFIDENTIAL_AI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "chainlink-confidential-attester-v1",
          input: {
            raffleId,
            ticketsSold:  raffle.ticketsSold,
            totalRevenue: raffle.totalRevenue.toString(),
            token:        tokenLabel,
            creator:      raffle.creator,
          },
          task: "assess_raffle_fairness",
        }),
        confidential: true,
      })
      aiHash = ethers.keccak256(ethers.toUtf8Bytes(aiRes.signature)) as `0x${string}`
      runtime.log(`Raffle #${raffleId}: AI attestation ✓ ${aiHash.slice(0, 10)}...`)
    } catch {
      runtime.log(`Raffle #${raffleId}: AI unavailable — proceeding`)
    }

    // BFT consensus randomness
    const rnd = await runtime.Rand()
    const winnerIndex = rnd.Intn(raffle.ticketsSold)
    runtime.log(`Raffle #${raffleId}: winner index ${winnerIndex}/${raffle.ticketsSold}`)

    // Write settlement — onReport() pushes tokens to winner + creator
    const report = encodeReport(raffleId, winnerIndex, aiHash)
    const tx = await runtime.evmClient.write({
      chainId: WORLD_CHAIN_ID, address: WLD5050_CONTRACT,
      function: "onReport",
      args: [WORKFLOW_METADATA, report],
      abi: WLD5050_ABI,
    })

    runtime.log(`Raffle #${raffleId}: settled ✓ tx ${tx}`)
    runtime.log(`  ${tokenLabel} pushed 50% → winner, 50% → creator (atomic, no claiming)`)
  }

  runtime.log("Workflow complete")
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function readRaffleState(runtime: any, raffleId: number): Promise<RaffleState> {
  const r = await runtime.evmClient.read({
    chainId: WORLD_CHAIN_ID, address: WLD5050_CONTRACT,
    function: "getRaffleState", args: [raffleId], abi: WLD5050_ABI,
  })
  return {
    raffleId,
    creator:      r[0],
    token:        Number(r[1]),
    ticketsSold:  Number(r[2]),
    ticketPrice:  BigInt(r[3]),
    endTime:      Number(r[4]),
    totalRevenue: BigInt(r[5]),
    isEnded:      r[6],
    status:       Number(r[7]),
  }
}

function encodeReport(raffleId: number, winnerIndex: number, aiHash: string): string {
  return ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256", "uint256", "bytes32"],
    [raffleId, winnerIndex, aiHash]
  )
}

const WORKFLOW_METADATA = ethers.AbiCoder.defaultAbiCoder().encode(
  ["string", "string"], ["wld5050-settlement-v2", "wld5050"]
)

const WLD5050_ABI = [
  "function getExpiredRaffles() view returns (uint256[])",
  "function getRaffleState(uint256) view returns (address,uint8,uint256,uint256,uint256,uint256,bool,uint8)",
  "function onReport(bytes,bytes) external",
]
