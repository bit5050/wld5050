import { getAddress, type Address } from 'viem'
import { ensSubnameLabel } from '@/lib/ens-claim/constants'
import { resolveEnsToAddress } from '@/lib/ens/resolve'

/** True when the winner subname forward-resolves to the winner on Ethereum L1. */
export async function isWinnerEnsMinted(
  winnerSubname: string,
  winner: Address,
): Promise<boolean> {
  const label = ensSubnameLabel(winnerSubname)
  if (!label) return false

  const fullName = `${label}.wld5050.eth`
  const resolved = await resolveEnsToAddress(fullName)
  if (!resolved) return false

  return getAddress(resolved) === getAddress(winner)
}
