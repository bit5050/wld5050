/**
 * WLD5050 CRE settlement workflow — polls every 30 seconds for expired raffles.
 *
 * Simulate from wld5050-contracts/:
 *   cre workflow simulate wld5050-settlement --target staging-settings
 */
import {
  CronCapability,
  EVMClientCapability,
  HTTPClientCapability,
  handler,
  Runner,
  identical,
  ConsensusAggregationByFields,
  type CronPayload,
  type Runtime,
} from '@chainlink/cre-sdk'
import {
  decodeFunctionResult,
  encodeAbiParameters,
  encodeFunctionData,
  keccak256,
  parseAbi,
  parseAbiParameters,
  zeroHash,
} from 'viem'

type Config = {
  schedule: string
  wld5050Contract: string
  chainSelectorName: string
  agentKitEndpoint: string
  confidentialAiUrl: string
}

type RaffleState = {
  raffleId: number
  creator: string
  token: number
  ticketsSold: number
  endTime: number
  isEnded: boolean
  status: number
}

const LAST_FINALIZED_BLOCK = 0n
const TOKEN_LABELS = ['USDC', 'WLD'] as const

const wld5050Abi = parseAbi([
  'function getExpiredRaffles() view returns (uint256[])',
  'function getRaffleState(uint256 raffleId) view returns (address creator, uint8 token, uint256 ticketsSold, uint256 ticketPrice, uint256 endTime, uint256 totalRevenue, bool isEnded, uint8 status)',
])

function winnerIndex(
  raffleId: number,
  ticketsSold: number,
  scheduledAtSec: bigint,
): number {
  const hash = keccak256(
    encodeAbiParameters(parseAbiParameters('uint256, uint256, uint256'), [
      BigInt(raffleId),
      BigInt(ticketsSold),
      scheduledAtSec,
    ]),
  )
  return Number(BigInt(hash) % BigInt(ticketsSold))
}

function encodeSettlementReport(
  raffleId: number,
  winnerIndexValue: number,
  aiHash: `0x${string}`,
): `0x${string}` {
  return encodeAbiParameters(
    parseAbiParameters('uint256 raffleId, uint256 winnerIndex, bytes32 aiAttestationHash'),
    [BigInt(raffleId), BigInt(winnerIndexValue), aiHash],
  )
}

async function readExpiredRaffleIds(
  runtime: Runtime<Config>,
  evmClient: EVMClientCapability,
): Promise<number[]> {
  const data = encodeFunctionData({
    abi: wld5050Abi,
    functionName: 'getExpiredRaffles',
  })

  const result = evmClient
    .callContract(runtime, {
      toAddress: runtime.config.wld5050Contract,
      chainSelectorName: runtime.config.chainSelectorName,
      callMsg: { data, blockNumber: LAST_FINALIZED_BLOCK },
    })
    .result()

  const ids = decodeFunctionResult({
    abi: wld5050Abi,
    functionName: 'getExpiredRaffles',
    data: result.data as `0x${string}`,
  }) as readonly bigint[]

  return ids.map((id) => Number(id))
}

async function readRaffleState(
  runtime: Runtime<Config>,
  evmClient: EVMClientCapability,
  raffleId: number,
): Promise<RaffleState> {
  const data = encodeFunctionData({
    abi: wld5050Abi,
    functionName: 'getRaffleState',
    args: [BigInt(raffleId)],
  })

  const result = evmClient
    .callContract(runtime, {
      toAddress: runtime.config.wld5050Contract,
      chainSelectorName: runtime.config.chainSelectorName,
      callMsg: { data, blockNumber: LAST_FINALIZED_BLOCK },
    })
    .result()

  const decoded = decodeFunctionResult({
    abi: wld5050Abi,
    functionName: 'getRaffleState',
    data: result.data as `0x${string}`,
  }) as readonly [
    `0x${string}`,
    number,
    bigint,
    bigint,
    bigint,
    bigint,
    boolean,
    number,
  ]

  return {
    raffleId,
    creator: decoded[0],
    token: Number(decoded[1]),
    ticketsSold: Number(decoded[2]),
    endTime: Number(decoded[4]),
    isEnded: decoded[6],
    status: Number(decoded[7]),
  }
}

function writeSettlement(
  runtime: Runtime<Config>,
  evmClient: EVMClientCapability,
  raffleId: number,
  winnerIndexValue: number,
  aiHash: `0x${string}`,
): string {
  const reportPayload = encodeSettlementReport(raffleId, winnerIndexValue, aiHash)
  const signedReport = runtime.report(reportPayload)

  const tx = evmClient
    .writeReport(runtime, {
      toAddress: runtime.config.wld5050Contract,
      chainSelectorName: runtime.config.chainSelectorName,
      report: signedReport,
      gasLimit: 1_500_000n,
    })
    .result()

  return tx.txHash
}

function agentKitApproved(
  runtime: Runtime<Config>,
  httpClient: HTTPClientCapability,
  raffle: RaffleState,
): boolean {
  const tokenLabel = TOKEN_LABELS[raffle.token] ?? 'UNKNOWN'

  const fetchAgentKit = (url: string, body: string): { ok: boolean } => {
    const response = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    return { ok: response.ok }
  }

  try {
    const result = httpClient
      .sendRequest(runtime, fetchAgentKit, ConsensusAggregationByFields<{ ok: boolean }>({
        ok: identical,
      }))(runtime.config.agentKitEndpoint, JSON.stringify({
        raffleId: raffle.raffleId,
        creator: raffle.creator,
        token: tokenLabel,
      }))
      .result()

    return result.ok
  } catch {
    runtime.log(`Raffle #${raffle.raffleId}: AgentKit unavailable — proceeding for demo`)
    return true
  }
}

const onCronTrigger = (runtime: Runtime<Config>, payload: CronPayload): string => {
  runtime.log('WLD5050 settlement cron fired')

  const scheduledAtSec = payload.scheduledExecutionTime
    ? BigInt(payload.scheduledExecutionTime.seconds)
    : BigInt(Math.floor(runtime.now().getTime() / 1000))

  const evmClient = new EVMClientCapability()
  const httpClient = new HTTPClientCapability()

  const expiredIds = readExpiredRaffleIds(runtime, evmClient)
  runtime.log(`Expired raffles: ${expiredIds.length}`)

  if (!expiredIds.length) {
    return 'no-expired-raffles'
  }

  let settled = 0

  for (const raffleId of expiredIds) {
    const raffle = readRaffleState(runtime, evmClient, raffleId)
    const tokenLabel = TOKEN_LABELS[raffle.token] ?? 'UNKNOWN'
    runtime.log(
      `Raffle #${raffleId} | token: ${tokenLabel} | tickets: ${raffle.ticketsSold}`,
    )

    if (raffle.ticketsSold === 0) {
      const txHash = writeSettlement(runtime, evmClient, raffleId, 0, zeroHash)
      runtime.log(`Raffle #${raffleId}: expired (0 tickets) tx ${txHash}`)
      settled++
      continue
    }

    if (!agentKitApproved(runtime, httpClient, raffle)) {
      runtime.log(`Raffle #${raffleId}: AgentKit rejected — skipping`)
      continue
    }

    const index = winnerIndex(raffleId, raffle.ticketsSold, scheduledAtSec)
    runtime.log(`Raffle #${raffleId}: winner index ${index}/${raffle.ticketsSold}`)

    const txHash = writeSettlement(runtime, evmClient, raffleId, index, zeroHash)
    runtime.log(`Raffle #${raffleId}: settled tx ${txHash}`)
    settled++
  }

  runtime.log(`Workflow complete — settled ${settled} raffle(s)`)
  return `settled-${settled}`
}

const initWorkflow = (config: Config) => {
  const cron = new CronCapability()
  return [handler(cron.trigger({ schedule: config.schedule }), onCronTrigger)]
}

export async function main() {
  const runner = await Runner.newRunner<Config>()
  await runner.run(initWorkflow)
}
