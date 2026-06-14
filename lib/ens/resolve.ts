import { createPublicClient, http, type Address } from 'viem'
import { mainnet } from 'viem/chains'
import { ethMainnetServerRpcUrl } from '@/lib/chains/eth-mainnet-rpc'

let client: ReturnType<typeof createPublicClient> | null = null

function getEnsClient() {
  if (!client) {
    client = createPublicClient({
      chain: mainnet,
      transport: http(ethMainnetServerRpcUrl),
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
