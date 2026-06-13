'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { worldchain } from '@/lib/chains/worldchain'
import { isValidPrivyAppId, publicEnv } from '@/lib/env.public'
import { wagmiConfig } from '@/lib/wagmi-config'

export default function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  if (!isValidPrivyAppId(publicEnv.privyAppId)) {
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={publicEnv.privyAppId}
      config={{
        loginMethods: ['email', 'google', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#000000',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        defaultChain: worldchain,
        supportedChains: [worldchain],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
