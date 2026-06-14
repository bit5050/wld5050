import { createPublicClient, http, type Chain, type PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { ethMainnetPublicRpcUrl } from '@/lib/chains/eth-mainnet-rpc'
import { worldchain } from '@/lib/chains/worldchain'
import { publicEnv } from '@/lib/env.public'

let worldChainCached: PublicClient | null = null
let mainnetCached: PublicClient | null = null

export function getPublicClient(chain?: Chain): PublicClient {
  if (chain?.id === mainnet.id) {
    if (!mainnetCached) {
      mainnetCached = createPublicClient({
        chain: mainnet,
        transport: http(ethMainnetPublicRpcUrl),
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
