/** Browser-safe Ethereum mainnet RPC (avoid cloudflare-eth.com — unreliable for eth_call). */
export const ethMainnetPublicRpcUrl =
  process.env.NEXT_PUBLIC_ETH_MAINNET_RPC_URL ??
  'https://ethereum-rpc.publicnode.com'

/** Server-side mainnet RPC with private URL fallback. */
export const ethMainnetServerRpcUrl =
  process.env.ETH_MAINNET_RPC_URL ?? ethMainnetPublicRpcUrl
