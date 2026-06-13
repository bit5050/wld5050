/**
 * Browser-safe env vars (NEXT_PUBLIC_*).
 * Safe to import in Client Components.
 */
export const publicEnv = {
  wldAppId: process.env.NEXT_PUBLIC_WLD_APP_ID ?? '',
  wldAction: process.env.NEXT_PUBLIC_WLD_ACTION ?? 'enter-raffle',
  privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '',
  contractAddress: process.env.NEXT_PUBLIC_WLD5050_CONTRACT ?? '',
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? '480'),
} as const

/** Privy app IDs are alphanumeric (legacy `cl…`, newer `cm…`, etc.). */
export function isValidPrivyAppId(appId: string): boolean {
  if (!appId || appId.includes('xxxx')) return false
  return /^[a-z0-9]{20,}$/i.test(appId)
}
