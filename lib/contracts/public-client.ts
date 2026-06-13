import { createPublicClient, http, type PublicClient } from 'viem'
import { worldchain } from '@/lib/chains/worldchain'

let cached: PublicClient | null = null

export function getPublicClient(): PublicClient {
  if (!cached) {
    cached = createPublicClient({
      chain: worldchain,
      transport: http(),
    })
  }
  return cached
}
