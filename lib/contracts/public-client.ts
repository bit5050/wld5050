import { createPublicClient, http, type Chain, type PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { worldchain } from '@/lib/chains/worldchain'
import { publicEnv } from '@/lib/env.public'

const ethMainnetRpcUrl =
  process.env.NEXT_PUBLIC_ETH_MAINNET_RPC_URL ?? 'https://cloudflare-eth.com'

let worldChainCached: PublicClient | null = null
let mainnetCached: PublicClient | null = null

export function getPublicClient(chain?: Chain): PublicClient {
  if (chain?.id === mainnet.id) {
    if (!mainnetCached) {
      mainnetCached = createPublicClient({
        chain: mainnet,
        transport: http(ethMainnetRpcUrl),
      })
    }
    return mainnetCached
  }

  if (!worldChainCached) {
    worldChainCached = createPublicClient({
      chain: worldchain,
      transport: http(publicEnv.worldChainRpcUrl),
    })
  }
  return worldChainCached
}
