/**
 * mintWinnerSubname.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Listens for WLD5050 RaffleSettled events on World Chain.
 * When a raffle settles, mints winner-round{N}.wld5050.eth to the winner's address.
 *
 * Why this runs on the frontend/backend (not inside the smart contract):
 * - ENS NameWrapper lives on Ethereum L1
 * - WLD5050.sol is deployed on World Chain (L2)
 * - Cross-chain call from L2 → L1 requires a bridge, which adds complexity
 * - Instead: the contract emits RaffleSettled with winnerSubname string
 * - This script (run by the WLD5050 frontend/backend) listens and mints on L1
 *
 * Source: https://docs.ens.domains/wrapper/creating-subname-registrar/
 *
 * To run:
 *   npx ts-node scripts/mintWinnerSubname.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createPublicClient, createWalletClient, http, namehash } from "viem"
import { privateKeyToAccount }   from "viem/accounts"
import { mainnet }               from "viem/chains"
import { worldchain }            from "viem/chains"  // World Chain (Chain ID 480)

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const WLD5050_CONTRACT    = process.env.WLD5050_CONTRACT!
const OPERATOR_PRIVATE_KEY = process.env.OPERATOR_PRIVATE_KEY! // bit5050.eth operator key
const ENS_NAME_WRAPPER     = "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401" // ENS NameWrapper on Ethereum L1
const ENS_PUBLIC_RESOLVER  = "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63"
const WLD5050_ETH_NODE     = namehash("wld5050.eth")

// ─── ABI FRAGMENTS ────────────────────────────────────────────────────────────

const RAFFLE_SETTLED_ABI = [{
  name: "RaffleSettled",
  type: "event",
  inputs: [
    { name: "raffleId",          type: "uint256", indexed: true  },
    { name: "winner",            type: "address", indexed: true  },
    { name: "creator",           type: "address", indexed: true  },
    { name: "token",             type: "uint8",   indexed: false },
    { name: "winnerPrize",       type: "uint256", indexed: false },
    { name: "creatorPayout",     type: "uint256", indexed: false },
    { name: "aiAttestationHash", type: "bytes32", indexed: false },
    { name: "winnerSubname",     type: "string",  indexed: false },
  ],
}] as const

const NAME_WRAPPER_ABI = [{
  name: "setSubnodeRecord",
  type: "function",
  inputs: [
    { name: "parentNode", type: "bytes32" },
    { name: "label",      type: "string"  },
    { name: "owner",      type: "address" },
    { name: "resolver",   type: "address" },
    { name: "ttl",        type: "uint64"  },
    { name: "fuses",      type: "uint32"  },
    { name: "expiry",     type: "uint64"  },
  ],
  outputs: [{ name: "node", type: "bytes32" }],
}] as const

// ─── CLIENTS ──────────────────────────────────────────────────────────────────

// World Chain client — watch for RaffleSettled events
const worldChainClient = createPublicClient({
  chain:     worldchain,
  transport: http(process.env.WORLD_CHAIN_RPC_URL),
})

// Ethereum L1 wallet — mints ENS subnames
const operatorKey = OPERATOR_PRIVATE_KEY.startsWith("0x")
  ? OPERATOR_PRIVATE_KEY
  : `0x${OPERATOR_PRIVATE_KEY}`
const account = privateKeyToAccount(operatorKey as `0x${string}`)
const l1WalletClient = createWalletClient({
  account,
  chain:     mainnet,
  transport: http(process.env.ETH_MAINNET_RPC_URL),
})

// ─── MAIN LISTENER ────────────────────────────────────────────────────────────

async function watchAndMintSubnames() {
  console.log("WLD5050 ENS subname minter started")
  console.log("Watching World Chain for RaffleSettled events...")

  worldChainClient.watchContractEvent({
    address: WLD5050_CONTRACT as `0x${string}`,
    abi:     RAFFLE_SETTLED_ABI,
    eventName: "RaffleSettled",

    onLogs: async (logs) => {
      for (const log of logs) {
        const { raffleId, winner, winnerPrize, winnerSubname, token } = log.args
        const tokenLabel = token === 0 ? "USDC" : "WLD"
        const prizeDisplay = token === 0
          ? `$${Number(winnerPrize) / 1_000_000} USDC`
          : `${Number(winnerPrize) / 1e18} WLD`

        console.log(`\nRaffleSettled detected:`)
        console.log(`  Raffle #${raffleId}`)
        console.log(`  Winner:  ${winner}`)
        console.log(`  Prize:   ${prizeDisplay} (${tokenLabel})`)
        console.log(`  Subname: ${winnerSubname}`)

        // Extract label from "winner-round{N}.wld5050.eth"
        // e.g. "winner-round42.wld5050.eth" → label = "winner-round42"
        const label = winnerSubname!.split(".")[0]

        await mintWinnerSubname(winner as `0x${string}`, label, Number(raffleId))
      }
    },

    onError: (err) => {
      console.error("Event watch error:", err)
    },
  })
}

// ─── MINT FUNCTION ────────────────────────────────────────────────────────────

async function mintWinnerSubname(
  winnerAddress: `0x${string}`,
  label:         string,     // e.g. "winner-round42"
  raffleId:      number
) {
  console.log(`Minting ENS subname: ${label}.wld5050.eth → ${winnerAddress}`)

  try {
    // ── Resolve winner's ENS name for logging ──────────────────────────────
    const l1ReadClient = createPublicClient({ chain: mainnet, transport: http() })
    const winnerEns = await l1ReadClient.getEnsName({ address: winnerAddress })
    console.log(`  Winner ENS: ${winnerEns ?? "no ENS name"}`)

    // ── Mint the winner subname on ENS NameWrapper (Ethereum L1) ──────────
    // setSubnodeRecord(parentNode, label, owner, resolver, ttl, fuses, expiry)
    //
    // Fuses: 0 = no restrictions (subname is fully transferable)
    // For "permanent" subnames, use PARENT_CANNOT_CONTROL (65536) + CAN_EXTEND_EXPIRY (262144)
    // Expiry: 0 = inherits parent wld5050.eth expiry (permanent)
    const txHash = await l1WalletClient.writeContract({
      address:      ENS_NAME_WRAPPER as `0x${string}`,
      abi:          NAME_WRAPPER_ABI,
      functionName: "setSubnodeRecord",
      args: [
        WLD5050_ETH_NODE,                    // parentNode: namehash("wld5050.eth")
        label,                               // label: "winner-round42"
        winnerAddress,                       // owner: winner receives the subname NFT
        ENS_PUBLIC_RESOLVER as `0x${string}`, // resolver
        BigInt(0),                           // ttl
        0,                                   // fuses: 0 = unrestricted
        BigInt(0),                           // expiry: 0 = inherit parent
      ],
    })

    console.log(`  ✓ Subname minted — L1 tx: ${txHash}`)
    console.log(`  ✓ ${label}.wld5050.eth now resolves to ${winnerAddress}`)
    console.log(`  ✓ Winner can verify at: https://app.ens.domains/${label}.wld5050.eth`)

  } catch (err) {
    console.error(`  ✗ Failed to mint subname for raffle #${raffleId}:`, err)
  }
}

// ─── ENS ADDRESS RESOLUTION (frontend utility) ────────────────────────────────

/// @notice Resolve any hex address to its ENS name — used throughout the frontend
/// @dev Returns null if no ENS name is set — fallback to truncated address
export async function resolveENS(address: `0x${string}`): Promise<string | null> {
  const client = createPublicClient({ chain: mainnet, transport: http() })
  try {
    return await client.getEnsName({ address })
  } catch {
    return null
  }
}

/// @notice Display rule: NEVER show hex addresses to users
/// @dev Use this everywhere in the UI: raffle cards, winner announcements, etc.
export function displayAddress(address: string, ensName: string | null): string {
  if (ensName) return ensName                                  // alice.eth
  return `${address.slice(0, 6)}...${address.slice(-4)}`      // 0x1234...5678
}

/// @notice Build the winner subname for a given raffle ID
export function winnerSubname(raffleId: number): string {
  return `winner-round${raffleId}.wld5050.eth`
}

// ─── START ────────────────────────────────────────────────────────────────────
watchAndMintSubnames().catch(console.error)
