import { parseAbiItem, type Address, type PublicClient } from 'viem'
import { WLD5050_DEPLOY_BLOCK } from '@/lib/contracts/contract-address'

/** World Chain RPC limits eth_getLogs to 100 blocks per request. */
const LOG_BLOCK_RANGE = BigInt(100)

const raffleCreatedEvent = parseAbiItem(
  'event RaffleCreated(uint256 indexed raffleId, address indexed creator, uint8 token, uint256 endTime, string name)',
)

const startTimeCache = new Map<string, number | null>()

function cacheKey(contractAddress: Address, raffleId: number): string {
  return `${contractAddress.toLowerCase()}:${raffleId}`
}

export async function fetchRaffleStartTime(
  raffleId: number,
  publicClient: PublicClient,
  contractAddress: Address,
): Promise<number | null> {
  const key = cacheKey(contractAddress, raffleId)
  if (startTimeCache.has(key)) {
    return startTimeCache.get(key) ?? null
  }

  try {
    const deployFrom = WLD5050_DEPLOY_BLOCK
    const latest = await publicClient.getBlockNumber()
    let toBlock = latest

    while (toBlock >= deployFrom) {
      const fromBlock =
        toBlock - LOG_BLOCK_RANGE + BigInt(1) < deployFrom
          ? deployFrom
          : toBlock - LOG_BLOCK_RANGE + BigInt(1)

      const logs = await publicClient.getLogs({
        address: contractAddress,
        event: raffleCreatedEvent,
        args: { raffleId: BigInt(raffleId) },
        fromBlock,
        toBlock,
      })

      if (logs.length > 0) {
        const block = await publicClient.getBlock({ blockNumber: logs[0].blockNumber })
        const startTime = Number(block.timestamp)
        startTimeCache.set(key, startTime)
        return startTime
      }

      if (fromBlock === deployFrom) break
      toBlock = fromBlock - BigInt(1)
    }

    startTimeCache.set(key, null)
    return null
  } catch {
    startTimeCache.set(key, null)
    return null
  }
}

export function getRaffleDeployFromBlock(): bigint {
  return WLD5050_DEPLOY_BLOCK
}

/** When start time is unknown, treat raffle as already open until endTime. */
export function fallbackRaffleStartTime(): number {
  return 0
}
