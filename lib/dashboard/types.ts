import type { PaymentToken } from '@/lib/contracts/wld5050'

export type DashboardRaffleStatus =
  | 'Active'
  | 'Awaiting settlement'
  | 'Completed'
  | 'Expired'

export interface DashboardRaffleItem {
  id: number
  name: string
  role: 'Creator' | 'Player' | 'Winner'
  ticketsHeld: number
  token: PaymentToken
  ticketsSold: number
  poolAmount: number
  status: DashboardRaffleStatus
  endTime: number
  winnerPrize?: number
}

export interface WalletBalances {
  eth: number
  usdc: number
  wld: number
}

export interface DashboardStats {
  usdcWon: number
  wldWon: number
  rafflesCreated: number
  rafflesWon: number
  rafflesPlayed: number
  winRate: number
}

export interface DashboardData {
  stats: DashboardStats
  balances: WalletBalances
  created: DashboardRaffleItem[]
  won: DashboardRaffleItem[]
  played: DashboardRaffleItem[]
}

export const emptyDashboardData: DashboardData = {
  stats: {
    usdcWon: 0,
    wldWon: 0,
    rafflesCreated: 0,
    rafflesWon: 0,
    rafflesPlayed: 0,
    winRate: 0,
  },
  balances: { eth: 0, usdc: 0, wld: 0 },
  created: [],
  won: [],
  played: [],
}
