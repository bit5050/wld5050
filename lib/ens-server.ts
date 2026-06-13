import 'server-only'
import { createPublicClient, http, type PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { serverEnv } from '@/lib/env.server'

let client: PublicClient | null = null

function getEnsClient(): PublicClient {
  if (client) return client

  const rpcUrl = serverEnv.ethMainnetRpcUrl()
  client = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  })
  return client
}

export async function resolveENS(address: `0x${string}`): Promise<string | null> {
  try {
    return await getEnsClient().getEnsName({ address })
  } catch {
    return null
  }
}

export async function resolveAddress(name: string): Promise<`0x${string}` | null> {
  try {
    return await getEnsClient().getEnsAddress({ name })
  } catch {
    return null
  }
}
