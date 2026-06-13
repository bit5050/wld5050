import 'server-only'

/**
 * Server-only env vars. Never import this file in Client Components.
 * RPC URLs, API secrets, and private keys belong here — not in NEXT_PUBLIC_.
 */
function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required server env var: ${name}`)
  }
  return value
}

function optional(name: string): string | undefined {
  const value = process.env[name]
  return value && value.length > 0 ? value : undefined
}

export const serverEnv = {
  ethMainnetRpcUrl: () => optional('ETH_MAINNET_RPC_URL'),
  worldChainRpcUrl: () => optional('WORLD_CHAIN_RPC_URL'),
  privyAppSecret: () => optional('PRIVY_APP_SECRET'),
  chainlinkCreApiKey: () => optional('CHAINLINK_CRE_API_KEY'),
  worldRpId: () => optional('WORLD_RP_ID'),
  worldRpSigningKey: () => optional('WORLD_RP_SIGNING_KEY'),
  /** Throws if unset — use when the route cannot run without an RPC. */
  requireEthMainnetRpcUrl: () => required('ETH_MAINNET_RPC_URL'),
} as const
