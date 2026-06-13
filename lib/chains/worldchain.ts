import { defineChain } from 'viem'

export const WORLD_CHAIN_ID = 480

const rpcUrl =
  process.env.NEXT_PUBLIC_WORLD_CHAIN_RPC_URL ??
  'https://worldchain-mainnet.g.alchemy.com/public'

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
