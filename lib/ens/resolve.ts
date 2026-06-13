import { createPublicClient, http, type Address } from 'viem'
import { mainnet } from 'viem/chains'

let client: ReturnType<typeof createPublicClient> | null = null

function getEnsClient() {
  if (!client) {
    const rpcUrl =
      process.env.ETH_MAINNET_RPC_URL ??
      process.env.NEXT_PUBLIC_ETH_MAINNET_RPC_URL ??
      'https://cloudflare-eth.com'

    client = createPublicClient({
      chain: mainnet,
      transport: http(rpcUrl),
    })
  }
  return client
}

export async function resolveEnsToAddress(name: string): Promise<Address | null> {
  const trimmed = name.trim()
  if (!trimmed) return null

  try {
    return await getEnsClient().getEnsAddress({ name: trimmed })
  } catch {
    return null
  }
}
