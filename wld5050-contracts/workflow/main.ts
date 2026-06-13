/**
 * WLD5050 CRE settlement workflow — polls every 30 seconds for expired raffles.
 *
 * From wld5050-contracts/:
 *   cre workflow simulate workflow --target production-settings --non-interactive --trigger-index 0
 */
import {
  CronCapability,
  EVMClient,
  HTTPClient,
  handler,
  Runner,
  identical,
  ConsensusAggregationByFields,
  type CronPayload,
  type Runtime,
  LAST_FINALIZED_BLOCK_NUMBER,
  encodeCallMsg,
  prepareReportRequest,
  json,
  ok,
} from '@chainlink/cre-sdk'
import {
  bytesToHex,
  decodeFunctionResult,
  encodeAbiParameters,
  encodeFunctionData,
  keccak256,
  parseAbi,
  parseAbiParameters,
  zeroAddress,
  zeroHash,
  type Address,
  type Hex,
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

const TOKEN_LABELS = ['USDC', 'WLD'] as const

const wld5050Abi = parseAbi([
  'function getExpiredRaffles() view returns (uint256[])',
  'function getRaffleState(uint256 raffleId) view returns (address creator, uint8 token, uint256 ticketsSold, uint256 ticketPrice, uint256 endTime, uint256 totalRevenue, bool isEnded, uint8 status)',
])

function getEvmClient(config: Config): EVMClient {
  const selector =
    EVMClient.SUPPORTED_CHAIN_SELECTORS[
      config.chainSelectorName as keyof typeof EVMClient.SUPPORTED_CHAIN_SELECTORS
    ]
  if (!selector) {
    throw new Error(`Unsupported chain selector: ${config.chainSelectorName}`)
  }
  return new EVMClient(selector)
}

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
  aiHash: Hex,
): Hex {
  return encodeAbiParameters(
    parseAbiParameters('uint256 raffleId, uint256 winnerIndex, bytes32 aiAttestationHash'),
    [BigInt(raffleId), BigInt(winnerIndexValue), aiHash],
  )
}

function readExpiredRaffleIds(
  runtime: Runtime<Config>,
  evmClient: EVMClient,
): number[] {
  const data = encodeFunctionData({
    abi: wld5050Abi,
    functionName: 'getExpiredRaffles',
  })

  const result = evmClient
    .callContract(runtime, {
      call: encodeCallMsg({
        from: zeroAddress,
        to: runtime.config.wld5050Contract as Address,
        data,
      }),
      blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
    })
    .result()

  if (!result.data?.length) {
    return []
  }

  const ids = decodeFunctionResult({
    abi: wld5050Abi,
    functionName: 'getExpiredRaffles',
    data: bytesToHex(result.data) as Hex,
  }) as readonly bigint[]

  return ids.map((id) => Number(id))
}

function readRaffleState(
  runtime: Runtime<Config>,
  evmClient: EVMClient,
  raffleId: number,
): RaffleState {
  const data = encodeFunctionData({
    abi: wld5050Abi,
    functionName: 'getRaffleState',
    args: [BigInt(raffleId)],
  })

  const result = evmClient
    .callContract(runtime, {
      call: encodeCallMsg({
        from: zeroAddress,
        to: runtime.config.wld5050Contract as Address,
        data,
      }),
      blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
    })
    .result()

  const decoded = decodeFunctionResult({
    abi: wld5050Abi,
    functionName: 'getRaffleState',
    data: bytesToHex(result.data) as Hex,
  }) as readonly [Address, number, bigint, bigint, bigint, bigint, boolean, number]

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
  evmClient: EVMClient,
  raffleId: number,
  winnerIndexValue: number,
  aiHash: Hex,
): string {
  const reportPayload = encodeSettlementReport(raffleId, winnerIndexValue, aiHash)
  const signedReport = runtime.report(prepareReportRequest(reportPayload)).result()

  const tx = evmClient
    .writeReport(runtime, {
      receiver: runtime.config.wld5050Contract,
      report: signedReport,
      gasConfig: { gasLimit: '1500000' },
    })
    .result()

  if (!tx.txHash) return 'unknown'
  return typeof tx.txHash === 'string' ? tx.txHash : bytesToHex(tx.txHash)
}

function agentKitApproved(
  runtime: Runtime<Config>,
  httpClient: HTTPClient,
  raffle: RaffleState,
): boolean {
  const tokenLabel = TOKEN_LABELS[raffle.token] ?? 'UNKNOWN'

  try {
    const approved = httpClient
      .sendRequest(
        runtime,
        (sendRequester, ...args: unknown[]) => {
          const endpoint = args[0] as string
          const body = args[1] as string
          const response = sendRequester
            .sendRequest({
              url: endpoint,
              method: 'POST',
              body,
              headers: { 'Content-Type': 'application/json' },
            })
            .result()

          if (!ok(response)) return { approved: false }
          const payload = json(response) as { ok?: boolean }
          return { approved: payload.ok === true }
        },
        ConsensusAggregationByFields<{ approved: boolean }>({ approved: identical }),
      )(
        runtime.config.agentKitEndpoint,
        JSON.stringify({
          raffleId: raffle.raffleId,
          creator: raffle.creator,
          token: tokenLabel,
        }),
      )
      .result().approved

    return approved
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

  const evmClient = getEvmClient(runtime.config)
  const httpClient = new HTTPClient()

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
