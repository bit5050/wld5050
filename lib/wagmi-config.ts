import { createConfig } from '@privy-io/wagmi'
import { http } from 'wagmi'
import { worldchain } from '@/lib/chains/worldchain'

export const wagmiConfig = createConfig({
  chains: [worldchain],
  transports: {
    [worldchain.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
