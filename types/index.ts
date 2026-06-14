import type { PaymentToken } from '@/lib/contracts/wld5050'

export type RaffleStatus = 'ACTIVE' | 'SETTLED' | 'EXPIRED' | 'REFUNDED'

export interface Raffle {
  id: number
  name: string
  creator: string
  creatorEns: string | null
  ticketsSold: number
  paymentToken: PaymentToken
  startTime: number
  endTime: number
  status: RaffleStatus
  aiAttestationHash?: string
}

export interface Settlement {
  raffleId: number
  winner: string
  winnerEns: string | null
  creator: string
  creatorEns: string | null
  winnerSubname: string
  winnerPrize: number
  creatorPayout: number
  ticketsSold: number
  paymentToken: PaymentToken
  txHash: string
  blockNumber: number
  ensMinted: boolean
  creSteps: CREStep[]
}

export interface CompletedRaffle extends Settlement {
  raffleName: string
  ticketsSold: number
}

export interface CREStep {
  label: string
  detail: string
  mono?: string
  status: 'done' | 'pending' | 'error'
}

export {
  PLATFORM_FEE,
  PLATFORM_FEE_DUAL_LABEL,
  PLATFORM_FEE_DUAL_LONG,
  PLATFORM_FEE_TO_WALLET,
  PLATFORM_FEE_USDC,
  PLATFORM_FEE_USDC_LABEL,
  PLATFORM_FEE_WLD,
  PLATFORM_FEE_WLD_LABEL,
  TICKET_PRICE,
  TICKET_PRICE_DUAL_LABEL,
  TICKET_PRICE_DUAL_LONG,
  TICKET_PRICE_USDC,
  TICKET_PRICE_USDC_LABEL,
  TICKET_PRICE_WLD,
  TICKET_PRICE_WLD_LABEL,
} from '@/lib/pricing'

export const PLATFORM_WALLET = 'wld5050.eth'
export const AGENT_ENS       = 'agent.wld5050.eth'
export const OPERATOR_ENS    = 'bit5050.eth'
