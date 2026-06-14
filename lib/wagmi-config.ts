import { createConfig } from '@privy-io/wagmi'
import { http } from 'wagmi'
import { mainnet } from 'viem/chains'
import { worldchain } from '@/lib/chains/worldchain'
import { publicEnv } from '@/lib/env.public'

const ethMainnetRpcUrl =
  process.env.NEXT_PUBLIC_ETH_MAINNET_RPC_URL ??
  process.env.ETH_MAINNET_RPC_URL ??
  'https://cloudflare-eth.com'

export const wagmiConfig = createConfig({
  chains: [worldchain, mainnet],
  transports: {
    [worldchain.id]: http(publicEnv.worldChainRpcUrl),
    [mainnet.id]: http(ethMainnetRpcUrl),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
