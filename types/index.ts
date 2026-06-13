export type RaffleStatus = 'ACTIVE' | 'SETTLED' | 'EXPIRED' | 'REFUNDED'

export interface Raffle {
  id: number
  name: string
  creator: string
  creatorEns: string | null
  ticketsSold: number
  endTime: number
  status: RaffleStatus
  aiAttestationHash?: string
}

export interface Settlement {
  raffleId: number
  winner: string
  winnerEns: string | null
  winnerSubname: string
  winnerPrize: number
  creatorPayout: number
  txHash: string
  blockNumber: number
  creSteps: CREStep[]
}

export interface CREStep {
  label: string
  detail: string
  mono?: string
  status: 'done' | 'pending' | 'error'
}

export const TICKET_PRICE    = 2.5
export const PLATFORM_FEE    = 10.0
export const PLATFORM_WALLET = 'wld5050.eth'
export const AGENT_ENS       = 'agent.wld5050.eth'
export const OPERATOR_ENS    = 'bit5050.eth'
