import type { Address } from 'viem'

export const USDC_ADDRESS = '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1' as Address
export const WLD_TOKEN_ADDRESS = '0x2cFc85d8E48F8EAB294be644d9E25C3030863003' as Address

export const TICKET_PRICE_USDC = 2.5
export const TICKET_PRICE_WLD = 2.5
export const PLATFORM_FEE_USDC = 10
export const PLATFORM_FEE_WLD = 10

export const wld5050Abi = [
  {
    type: 'function',
    name: 'raffleCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getRaffleDetails',
    stateMutability: 'view',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'creator', type: 'address' },
      { name: 'token', type: 'uint8' },
      { name: 'ticketsSold', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'status', type: 'uint8' },
      { name: 'aiAttestationHash', type: 'bytes32' },
      { name: 'winnerSubname', type: 'string' },
    ],
  },
  {
    type: 'function',
    name: 'getRaffleState',
    stateMutability: 'view',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [
      { name: 'creator', type: 'address' },
      { name: 'token', type: 'uint8' },
      { name: 'ticketsSold', type: 'uint256' },
      { name: 'ticketPrice', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'totalRevenue', type: 'uint256' },
      { name: 'isEnded', type: 'bool' },
      { name: 'status', type: 'uint8' },
    ],
  },
  {
    type: 'function',
    name: 'getRaffleEntries',
    stateMutability: 'view',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [{ type: 'address[]' }],
  },
  {
    type: 'event',
    name: 'RaffleSettled',
    inputs: [
      { name: 'raffleId', type: 'uint256', indexed: true },
      { name: 'winner', type: 'address', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'token', type: 'uint8', indexed: false },
      { name: 'winnerPrize', type: 'uint256', indexed: false },
      { name: 'creatorPayout', type: 'uint256', indexed: false },
      { name: 'aiAttestationHash', type: 'bytes32', indexed: false },
      { name: 'winnerSubname', type: 'string', indexed: false },
    ],
  },
] as const

export const erc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const

export type PaymentToken = 'USDC' | 'WLD'

export function isValidContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address) && address !== '0x0000000000000000000000000000000000000000'
}

export function paymentTokenFromIndex(index: number): PaymentToken {
  return index === 1 ? 'WLD' : 'USDC'
}

export function formatRawTokenAmount(raw: bigint, token: PaymentToken): number {
  if (token === 'USDC') return Number(raw) / 1e6
  return Number(raw) / 1e18
}
