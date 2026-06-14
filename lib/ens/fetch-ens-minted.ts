import { createPublicClient, getAddress, http, type Address } from 'viem'
import { mainnet } from 'viem/chains'
import { ethMainnetPublicRpcUrl } from '@/lib/chains/eth-mainnet-rpc'
import {
  ensSubnameLabel,
  getWinnerEnsClaimRegistrarAddress,
  winnerEnsClaimRegistrarAbi,
} from '@/lib/ens-claim/constants'
import { resolveEnsToAddress } from '@/lib/ens/resolve'

let registrarClient: ReturnType<typeof createPublicClient> | null = null

function getRegistrarClient() {
  if (!registrarClient) {
    registrarClient = createPublicClient({
      chain: mainnet,
      transport: http(ethMainnetPublicRpcUrl),
    })
  }
  return registrarClient
}

/** True when this raffle id was claimed on the L1 WinnerEnsClaimRegistrar. */
export async function isEnsClaimedOnRegistrar(raffleId: number): Promise<boolean> {
  const registrar = getWinnerEnsClaimRegistrarAddress()
  if (!registrar) return false

  try {
    return await getRegistrarClient().readContract({
      address: registrar,
      abi: winnerEnsClaimRegistrarAbi,
      functionName: 'claimed',
      args: [BigInt(raffleId)],
    })
  } catch {
    return false
  }
}

/** True when badge is claimed on L1 or forward-resolves to the winner. */
export async function isWinnerEnsMinted(
  winnerSubname: string,
  winner: Address,
  raffleId: number,
): Promise<boolean> {
  if (await isEnsClaimedOnRegistrar(raffleId)) return true

  const label = ensSubnameLabel(winnerSubname)
  if (!label) return false

  const fullName = `${label}.wld5050.eth`
  const resolved = await resolveEnsToAddress(fullName)
  if (!resolved) return false

  return getAddress(resolved) === getAddress(winner)
}
