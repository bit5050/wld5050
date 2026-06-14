import { parseAbiItem, type Address, type PublicClient } from 'viem'
import { WLD5050_DEPLOY_BLOCK } from '@/lib/contracts/contract-address'
import {
  formatRawTokenAmount,
  paymentTokenFromIndex,
  wld5050Abi,
} from '@/lib/contracts/wld5050'
import { isEnsClaimedOnRegistrar, isWinnerEnsMinted } from '@/lib/ens/fetch-ens-minted'
import type { Settlement } from '@/types'

/** World Chain RPC limits eth_getLogs to 100 blocks per request. */
const LOG_BLOCK_RANGE = BigInt(100)

const raffleSettledEvent = parseAbiItem(
  'event RaffleSettled(uint256 indexed raffleId, address indexed winner, address indexed creator, uint8 token, uint256 winnerPrize, uint256 creatorPayout, bytes32 aiAttestationHash, string winnerSubname)',
)

const settlementCache = new Map<string, Settlement | null>()

function cacheKey(contractAddress: Address, raffleId: number): string {
  return `${contractAddress.toLowerCase()}:${raffleId}`
}

export function invalidateSettlementCache(contractAddress: Address, raffleId: number) {
  settlementCache.delete(cacheKey(contractAddress, raffleId))
}

async function findRaffleSettledLog(
  raffleId: number,
  publicClient: PublicClient,
  contractAddress: Address,
) {
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
      event: raffleSettledEvent,
      args: { raffleId: BigInt(raffleId) },
      fromBlock,
      toBlock,
    })

    if (logs.length > 0) {
      return logs[logs.length - 1]
    }

    if (fromBlock === deployFrom) break
    toBlock = fromBlock - BigInt(1)
  }

  return null
}

/** Loads winner, creator, payouts, and settlement tx from on-chain RaffleSettled event. */
export async function fetchRaffleSettlement(
  raffleId: number,
  publicClient: PublicClient,
  contractAddress: Address,
  ticketsSold: number,
): Promise<Settlement | null> {
  const key = cacheKey(contractAddress, raffleId)
  if (settlementCache.has(key)) {
    return settlementCache.get(key) ?? null
  }

  try {
    const log = await findRaffleSettledLog(raffleId, publicClient, contractAddress)

    if (log?.args.winner != null) {
      const token = paymentTokenFromIndex(Number(log.args.token))
      const settlement: Settlement = {
        raffleId,
        winner: log.args.winner as Address,
        winnerEns: null,
        creator: log.args.creator as Address,
        creatorEns: null,
        winnerSubname: (log.args.winnerSubname as string) || `winner-round${raffleId}.wld5050.eth`,
        winnerPrize: formatRawTokenAmount(log.args.winnerPrize as bigint, token),
        creatorPayout: formatRawTokenAmount(log.args.creatorPayout as bigint, token),
        ticketsSold,
        paymentToken: token,
        txHash: log.transactionHash,
        blockNumber: Number(log.blockNumber),
        ensMinted: await isWinnerEnsMinted(
          (log.args.winnerSubname as string) || `winner-round${raffleId}.wld5050.eth`,
          log.args.winner as Address,
          raffleId,
        ),
        creSteps: [],
      }
      settlementCache.set(key, settlement)
      return settlement
    }

    const [details, state] = await Promise.all([
      publicClient.readContract({
        address: contractAddress,
        abi: wld5050Abi,
        functionName: 'getRaffleDetails',
        args: [BigInt(raffleId)],
      }),
      publicClient.readContract({
        address: contractAddress,
        abi: wld5050Abi,
        functionName: 'getRaffleState',
        args: [BigInt(raffleId)],
      }),
    ])

    if (Number(details[5]) !== 1) {
      settlementCache.set(key, null)
      return null
    }

    const token = paymentTokenFromIndex(Number(state[1]))
    const totalRevenue = state[5] as bigint
    const winnerPrize = formatRawTokenAmount(totalRevenue / BigInt(2), token)
    const creatorPayout = formatRawTokenAmount(totalRevenue - totalRevenue / BigInt(2), token)

    const fallback: Settlement = {
      raffleId,
      winner: details[1] as Address,
      winnerEns: null,
      creator: details[1] as Address,
      creatorEns: null,
      winnerSubname: (details[7] as string) || `winner-round${raffleId}.wld5050.eth`,
      winnerPrize,
      creatorPayout,
      ticketsSold,
      paymentToken: token,
      txHash: '',
      blockNumber: 0,
      ensMinted: await isWinnerEnsMinted(
        (details[7] as string) || `winner-round${raffleId}.wld5050.eth`,
        details[1] as Address,
        raffleId,
      ),
      creSteps: [],
    }
    settlementCache.set(key, fallback)
    return fallback
  } catch {
    settlementCache.set(key, null)
    return null
  }
}
