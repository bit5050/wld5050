import { defineChain } from 'viem'
import { publicEnv } from '@/lib/env.public'

export const WORLD_CHAIN_ID = 480

const rpcUrl = publicEnv.worldChainRpcUrl

export const worldchain = defineChain({
  id: WORLD_CHAIN_ID,
  name: 'World Chain',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [rpcUrl] },
  },
  blockExplorers: {
    default: {
      name: 'Worldscan',
      url: 'https://worldscan.org',
    },
  },
})
