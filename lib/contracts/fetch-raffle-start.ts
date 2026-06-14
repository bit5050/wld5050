import { parseAbiItem, type Address, type PublicClient } from 'viem'
import { publicEnv } from '@/lib/env.public'

/** Known deploy blocks — bounds getLogs scans per contract. */
const DEPLOY_BLOCKS: Record<string, bigint> = {
  '0x787c5b5b464cea2d1482e3f0e605171b1f0d322e': BigInt(31_029_803),
  '0x98cb5b000f557c9a07fd724bb7a846486bd24c5c': BigInt(30_500_000),
}

const raffleCreatedEvent = parseAbiItem(
  'event RaffleCreated(uint256 indexed raffleId, address indexed creator, uint8 token, uint256 endTime, string name)',
)

export async function fetchRaffleStartTime(
  raffleId: number,
  publicClient: PublicClient,
  contractAddress: Address,
): Promise<number | null> {
  const fromBlock = DEPLOY_BLOCKS[contractAddress.toLowerCase()] ?? BigInt(0)

  const logs = await publicClient.getLogs({
    address: contractAddress,
    event: raffleCreatedEvent,
    args: { raffleId: BigInt(raffleId) },
    fromBlock,
    toBlock: 'latest',
  })

  if (logs.length === 0) return null

  const block = await publicClient.getBlock({ blockNumber: logs[0].blockNumber })
  return Number(block.timestamp)
}

export function getRaffleDeployFromBlock(): bigint {
  const address = publicEnv.contractAddress.toLowerCase()
  return DEPLOY_BLOCKS[address] ?? BigInt(0)
}
