import type { Address } from 'viem'
import { isValidContractAddress } from '@/lib/contracts/wld5050'

/** Production WLD5050 on World Chain mainnet. */
export const WLD5050_CONTRACT_ADDRESS =
  '0x787C5b5B464CEa2D1482e3f0e605171B1f0D322E' as const satisfies Address

/** Bounds eth_getLogs scans for RaffleCreated events. */
export const WLD5050_DEPLOY_BLOCK = BigInt(31_029_803)

/** Retired deployments — always resolve to WLD5050_CONTRACT_ADDRESS. */
const LEGACY_CONTRACT_ADDRESSES = new Set([
  '0x98cb5b000f557c9a07fd724bb7a846486bd24c5c',
  '0x6f77c5b5b464cea2d1482e3f0e605171b1f0d322e',
])

export function resolveWld5050ContractAddress(
  envAddress = process.env.NEXT_PUBLIC_WLD5050_CONTRACT ?? '',
): Address {
  const normalized = envAddress.trim().toLowerCase()

  if (LEGACY_CONTRACT_ADDRESSES.has(normalized)) {
    return WLD5050_CONTRACT_ADDRESS
  }

  if (isValidContractAddress(envAddress)) {
    return envAddress as Address
  }

  return WLD5050_CONTRACT_ADDRESS
}

export function getWld5050ContractAddress(): Address {
  return resolveWld5050ContractAddress(process.env.NEXT_PUBLIC_WLD5050_CONTRACT)
}

export function getWld5050WorldscanUrl(path = ''): string {
  return `https://worldscan.org/address/${WLD5050_CONTRACT_ADDRESS}${path}`
}
