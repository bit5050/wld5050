/**
 * Browser-safe env vars (NEXT_PUBLIC_*).
 * Safe to import in Client Components.
 */
import { getWld5050ContractAddress } from '@/lib/contracts/contract-address'

export const publicEnv = {
  wldAppId: process.env.NEXT_PUBLIC_WLD_APP_ID ?? '',
  wldAction: process.env.NEXT_PUBLIC_WLD_ACTION ?? 'enter-raffle',
  privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '',
  contractAddress: getWld5050ContractAddress(),
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? '480'),
  worldChainRpcUrl:
    process.env.NEXT_PUBLIC_WORLD_CHAIN_RPC_URL ??
    'https://worldchain-mainnet.g.alchemy.com/public',
} as const

/** Privy app IDs are alphanumeric (legacy `cl…`, newer `cm…`, etc.). */
export function isValidPrivyAppId(appId: string): boolean {
  if (!appId || appId.includes('xxxx')) return false
  return /^[a-z0-9]{20,}$/i.test(appId)
}

/** World ID app IDs from the Developer Portal (`app_…`). */
export function isValidWorldAppId(appId: string): appId is `app_${string}` {
  if (!appId || appId.includes('xxxx')) return false
  return /^app_[a-z0-9]+$/i.test(appId)
}
