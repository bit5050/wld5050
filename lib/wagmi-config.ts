import { createConfig } from '@privy-io/wagmi'
import { http } from 'wagmi'
import { mainnet } from 'viem/chains'
import { ethMainnetPublicRpcUrl } from '@/lib/chains/eth-mainnet-rpc'
import { worldchain } from '@/lib/chains/worldchain'
import { publicEnv } from '@/lib/env.public'

export const wagmiConfig = createConfig({
  chains: [worldchain, mainnet],
  transports: {
    [worldchain.id]: http(publicEnv.worldChainRpcUrl),
    [mainnet.id]: http(ethMainnetPublicRpcUrl),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
