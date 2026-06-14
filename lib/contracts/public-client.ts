import { createPublicClient, http, type PublicClient } from 'viem'
import { worldchain } from '@/lib/chains/worldchain'
import { publicEnv } from '@/lib/env.public'

let cached: PublicClient | null = null

export function getPublicClient(): PublicClient {
  if (!cached) {
    cached = createPublicClient({
      chain: worldchain,
      transport: http(publicEnv.worldChainRpcUrl),
    })
  }
  return cached
}
