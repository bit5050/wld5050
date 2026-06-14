import { createConfig } from '@privy-io/wagmi'
import { http } from 'wagmi'
import { worldchain } from '@/lib/chains/worldchain'
import { publicEnv } from '@/lib/env.public'

export const wagmiConfig = createConfig({
  chains: [worldchain],
  transports: {
    [worldchain.id]: http(publicEnv.worldChainRpcUrl),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
