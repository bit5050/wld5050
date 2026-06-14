import type { Address, PublicClient } from 'viem'
import { publicEnv } from '@/lib/env.public'
import { resolveEnsToAddress } from '@/lib/ens/resolve'
import {
  formatRawTokenAmount,
  isValidContractAddress,
  paymentTokenFromIndex,
  wld5050Abi,
  type PaymentToken,
} from '@/lib/contracts/wld5050'
import { getPublicClient } from '@/lib/contracts/public-client'
import { fetchRaffleStartTime, fallbackRaffleStartTime } from '@/lib/contracts/fetch-raffle-start'
import type { CompletedRaffle, CREStep, Raffle, RaffleStatus, Settlement } from '@/types'

const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

export type RaffleListData = {
  active: Raffle[]
  completed: CompletedRaffle[]
}

function mapRaffleStatus(statusCode: number, isEnded: boolean): RaffleStatus {
  if (statusCode === 1) return 'SETTLED'
  if (statusCode === 2) return 'EXPIRED'
  if (isEnded) return 'EXPIRED'
  return 'ACTIVE'
}

function truncateHash(hash: string): string {
  if (!hash || hash === ZERO_HASH) return ''
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`
}

function buildCreSteps(
  raffleId: number,
  blockNumber: number,
  aiAttestationHash: string,
  winnerPrize: number,
  creatorPayout: number,
  winnerSubname: string,
): CREStep[] {
  const attestation = truncateHash(aiAttestationHash)
  return [
    {
      label: 'CRE cron triggered',
      detail: `Round #${raffleId} deadline passed`,
      mono: `block #${blockNumber.toLocaleString()}`,
      status: 'done',
    },
    {
      label: 'AI attestation',
      detail: attestation ? 'Round assessed fair' : 'Attestation pending',
      mono: attestation || undefined,
      status: attestation ? 'done' : 'pending',
    },
    {
      label: 'Settlement complete',
      detail: `$${winnerPrize.toFixed(2)} paid to winner · $${creatorPayout.toFixed(2)} to creator`,
      mono: winnerSubname || undefined,
      status: 'done',
    },
  ]
}

function getContractAddress(): Address | null {
  const address = publicEnv.contractAddress
  return isValidContractAddress(address) ? (address as Address) : null
}

async function resolveWinnerAddress(
  raffleId: number,
  creator: Address,
  winnerSubname: string,
): Promise<Address> {
  const subname = winnerSubname || `winner-round${raffleId}.wld5050.eth`
  const resolved = await resolveEnsToAddress(subname)
  return resolved ?? creator
}

export type FetchRafflesOptions = {
  /** When false, skips settled raffle enrichment (faster for buy-tickets). */
  includeCompleted?: boolean
}

export async function fetchRafflesFromContract(
  publicClient: PublicClient = getPublicClient(),
  contractAddress: Address | null = getContractAddress(),
  options: FetchRafflesOptions = {},
): Promise<RaffleListData> {
  const { includeCompleted = true } = options
  if (!contractAddress) {
    return { active: [], completed: [] }
  }

  const raffleCount = await publicClient.readContract({
    address: contractAddress,
    abi: wld5050Abi,
    functionName: 'raffleCount',
  })

  const total = Number(raffleCount)
  if (total === 0) {
    return { active: [], completed: [] }
  }

  const active: Raffle[] = []
  const completed: CompletedRaffle[] = []

  for (let id = 1; id <= total; id++) {
    const [details, state] = await Promise.all([
      publicClient.readContract({
        address: contractAddress,
        abi: wld5050Abi,
        functionName: 'getRaffleDetails',
        args: [BigInt(id)],
      }),
      publicClient.readContract({
        address: contractAddress,
        abi: wld5050Abi,
        functionName: 'getRaffleState',
        args: [BigInt(id)],
      }),
    ])

    const name = details[0]
    const creator = details[1] as Address
    const ticketsSold = Number(details[3])
    const endTime = Number(details[4])
    const statusCode = Number(details[5])
    const aiAttestationHash = details[6] as string
    const winnerSubname = details[7]
    const isEnded = state[6]
    const totalRevenue = state[5] as bigint
    const token = paymentTokenFromIndex(Number(state[1]))
    const status = mapRaffleStatus(statusCode, isEnded)

    if (statusCode === 1 && includeCompleted) {
      const winnerPrize = formatRawTokenAmount(totalRevenue / BigInt(2), token)
      const creatorPayout = formatRawTokenAmount(totalRevenue - totalRevenue / BigInt(2), token)
      const winner = await resolveWinnerAddress(id, creator, winnerSubname)

      completed.push({
        raffleId: id,
        raffleName: name,
        ticketsSold,
        winner,
        winnerEns: null,
        winnerSubname: winnerSubname || `winner-round${id}.wld5050.eth`,
        winnerPrize,
        creatorPayout,
        txHash: '',
        blockNumber: 0,
        creSteps: buildCreSteps(
          id,
          0,
          aiAttestationHash,
          winnerPrize,
          creatorPayout,
          winnerSubname || `winner-round${id}.wld5050.eth`,
        ),
      })
      continue
    }

    if (statusCode === 0 && !isEnded) {
      active.push({
        id,
        name,
        creator,
        creatorEns: null,
        ticketsSold,
        startTime: fallbackRaffleStartTime(),
        endTime,
        status,
        aiAttestationHash: aiAttestationHash !== ZERO_HASH ? aiAttestationHash : undefined,
      })
    }
  }

  active.sort((a, b) => b.id - a.id)
  completed.sort((a, b) => b.raffleId - a.raffleId)

  return { active, completed }
}

export async function fetchRaffleById(
  raffleId: number,
  publicClient: PublicClient = getPublicClient(),
  contractAddress: Address | null = getContractAddress(),
): Promise<Raffle | null> {
  if (!contractAddress || !Number.isFinite(raffleId) || raffleId < 1) {
    return null
  }

  const raffleCount = await publicClient.readContract({
    address: contractAddress,
    abi: wld5050Abi,
    functionName: 'raffleCount',
  })

  if (raffleId > Number(raffleCount)) {
    return null
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

  const statusCode = Number(details[5])
  const isEnded = state[6]
  const endTime = Number(details[4])
  const startTime =
    (await fetchRaffleStartTime(raffleId, publicClient, contractAddress)) ??
    fallbackRaffleStartTime()

  return {
    id: raffleId,
    name: details[0],
    creator: details[1] as Address,
    creatorEns: null,
    ticketsSold: Number(details[3]),
    startTime,
    endTime,
    status: mapRaffleStatus(statusCode, isEnded),
    aiAttestationHash:
      (details[6] as string) !== ZERO_HASH ? (details[6] as string) : undefined,
  }
}

export function toSettlement(raffle: CompletedRaffle): Settlement {
  return {
    raffleId: raffle.raffleId,
    winner: raffle.winner,
    winnerEns: raffle.winnerEns,
    winnerSubname: raffle.winnerSubname,
    winnerPrize: raffle.winnerPrize,
    creatorPayout: raffle.creatorPayout,
    ticketsSold: raffle.ticketsSold,
    txHash: raffle.txHash,
    blockNumber: raffle.blockNumber,
    creSteps: raffle.creSteps,
  }
}
