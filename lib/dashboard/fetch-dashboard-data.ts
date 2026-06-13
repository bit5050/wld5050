import type { Address, PublicClient } from 'viem'
import {
  erc20Abi,
  formatRawTokenAmount,
  isValidContractAddress,
  paymentTokenFromIndex,
  TICKET_PRICE_USDC,
  TICKET_PRICE_WLD,
  USDC_ADDRESS,
  wld5050Abi,
  WLD_TOKEN_ADDRESS,
  type PaymentToken,
} from '@/lib/contracts/wld5050'
import {
  emptyDashboardData,
  type DashboardData,
  type DashboardRaffleItem,
  type DashboardRaffleStatus,
} from '@/lib/dashboard/types'
import { resolveEnsToAddress } from '@/lib/ens/resolve'

function mapStatus(
  contractStatus: number,
  isEnded: boolean,
): DashboardRaffleStatus {
  if (contractStatus === 1) return 'Completed'
  if (contractStatus === 2) return 'Expired'
  if (isEnded) return 'Awaiting settlement'
  return 'Active'
}

function poolFromTickets(ticketsSold: number, token: PaymentToken): number {
  const price = token === 'USDC' ? TICKET_PRICE_USDC : TICKET_PRICE_WLD
  return ticketsSold * price
}

export async function fetchDashboardData(
  publicClient: PublicClient,
  contractAddress: Address,
  userAddress: Address,
): Promise<DashboardData> {
  if (!isValidContractAddress(contractAddress)) {
    return emptyDashboardData
  }

  const [ethBalance, usdcBalance, wldBalance, raffleCount] = await Promise.all([
    publicClient.getBalance({ address: userAddress }),
    publicClient.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [userAddress],
    }),
    publicClient.readContract({
      address: WLD_TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [userAddress],
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: wld5050Abi,
      functionName: 'raffleCount',
    }),
  ])

  const balances = {
    eth: Number(ethBalance) / 1e18,
    usdc: Number(usdcBalance) / 1e6,
    wld: Number(wldBalance) / 1e18,
  }

  const totalRaffles = Number(raffleCount)
  if (totalRaffles === 0) {
    return { ...emptyDashboardData, balances }
  }

  const winMap = new Map<number, { token: PaymentToken; prize: number }>()
  let usdcWon = 0
  let wldWon = 0

  const created: DashboardRaffleItem[] = []
  const won: DashboardRaffleItem[] = []
  const played: DashboardRaffleItem[] = []

  for (let id = 1; id <= totalRaffles; id++) {
    const [details, state, entries] = await Promise.all([
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
      publicClient.readContract({
        address: contractAddress,
        abi: wld5050Abi,
        functionName: 'getRaffleEntries',
        args: [BigInt(id)],
      }),
    ])

    const name = details[0]
    const creator = details[1] as Address
    const token = paymentTokenFromIndex(Number(details[2]))
    const ticketsSold = Number(details[3])
    const endTime = Number(details[4])
    const statusCode = Number(details[5])
    const winnerSubname = details[7]
    const isEnded = state[6]
    const totalRevenue = state[5] as bigint
    const status = mapStatus(statusCode, isEnded)
    const poolAmount = poolFromTickets(ticketsSold, token)

    if (statusCode === 1) {
      const subname = winnerSubname || `winner-round${id}.wld5050.eth`
      const winner = await resolveEnsToAddress(subname)
      if (winner?.toLowerCase() === userAddress.toLowerCase()) {
        const prize = formatRawTokenAmount(totalRevenue / BigInt(2), token)
        winMap.set(id, { token, prize })
        if (token === 'USDC') usdcWon += prize
        else wldWon += prize
      }
    }

    const isCreator = creator.toLowerCase() === userAddress.toLowerCase()
    const ticketsHeld = entries.filter(
      (entry) => entry.toLowerCase() === userAddress.toLowerCase(),
    ).length
    const isPlayer = ticketsHeld > 0
    const win = winMap.get(id)

    if (isCreator) {
      created.push({
        id,
        name,
        role: 'Creator',
        ticketsHeld: 0,
        token,
        ticketsSold,
        poolAmount,
        status,
        endTime,
      })
    }

    if (win) {
      won.push({
        id,
        name,
        role: 'Winner',
        ticketsHeld,
        token: win.token,
        ticketsSold,
        poolAmount,
        status: 'Completed',
        endTime,
        winnerPrize: win.prize,
      })
    }

    if (isPlayer) {
      played.push({
        id,
        name,
        role: win ? 'Winner' : 'Player',
        ticketsHeld,
        token,
        ticketsSold,
        poolAmount,
        status,
        endTime,
        winnerPrize: win?.prize,
      })
    }
  }

  const rafflesPlayed = played.length
  const rafflesWon = won.length
  const winRate = rafflesPlayed > 0 ? (rafflesWon / rafflesPlayed) * 100 : 0

  return {
    stats: {
      usdcWon,
      wldWon,
      rafflesCreated: created.length,
      rafflesWon,
      rafflesPlayed,
      winRate,
    },
    balances,
    created: created.sort((a, b) => b.id - a.id),
    won: won.sort((a, b) => b.id - a.id),
    played: played.sort((a, b) => b.id - a.id),
  }
}
