import type { Address } from 'viem'

export { WLD5050_CONTRACT_ADDRESS, WLD5050_DEPLOY_BLOCK } from '@/lib/contracts/contract-address'

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
    name: 'RaffleCreated',
    inputs: [
      { name: 'raffleId', type: 'uint256', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'token', type: 'uint8', indexed: false },
      { name: 'endTime', type: 'uint256', indexed: false },
      { name: 'name', type: 'string', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'TicketPurchased',
    inputs: [
      { name: 'raffleId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'ticketIndex', type: 'uint256', indexed: false },
    ],
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
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
] as const

export const wld5050WriteAbi = [
  {
    type: 'function',
    name: 'createRaffle',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'duration', type: 'uint256' },
      { name: 'token', type: 'uint8' },
      { name: 'root', type: 'uint256' },
      { name: 'nullifierHash', type: 'uint256' },
      { name: 'proof', type: 'uint256[8]' },
    ],
    outputs: [{ name: 'raffleId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'buyTicket',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'raffleId', type: 'uint256' },
      { name: 'root', type: 'uint256' },
      { name: 'nullifierHash', type: 'uint256' },
      { name: 'proof', type: 'uint256[8]' },
    ],
    outputs: [],
  },
] as const

export const PLATFORM_FEE_USDC_RAW = BigInt(10_000_000)
export const PLATFORM_FEE_WLD_RAW = BigInt(10) * BigInt(10 ** 18)
export const TICKET_PRICE_USDC_RAW = BigInt(2_500_000)
export const TICKET_PRICE_WLD_RAW = BigInt(25) * BigInt(10 ** 17)
export const PAYMENT_TOKEN_USDC = 0
export const PAYMENT_TOKEN_WLD = 1

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
