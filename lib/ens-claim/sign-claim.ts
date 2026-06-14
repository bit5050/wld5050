import 'server-only'

import { privateKeyToAccount } from 'viem/accounts'
import { getAddress, type Address, type Hex } from 'viem'
import {
  ENS_CLAIM_EIP712_DOMAIN,
  ensSubnameLabel,
  getWinnerEnsClaimRegistrarAddress,
} from '@/lib/ens-claim/constants'

const CLAIM_SIGNATURE_TTL_SECONDS = 60 * 60

function getClaimSignerKey(): Hex | null {
  const raw =
    process.env.ENS_CLAIM_SIGNER_PRIVATE_KEY?.trim() ??
    process.env.OPERATOR_PRIVATE_KEY?.trim()
  if (!raw) return null
  return (raw.startsWith('0x') ? raw : `0x${raw}`) as Hex
}

export type EnsClaimSignaturePayload = {
  raffleId: number
  label: string
  winnerSubname: string
  deadline: number
  signature: Hex
  registrarAddress: Address
  chainId: number
}

export async function signEnsClaim(params: {
  raffleId: number
  winner: Address
  winnerSubname: string
}): Promise<EnsClaimSignaturePayload | null> {
  const registrarAddress = getWinnerEnsClaimRegistrarAddress()
  const signerKey = getClaimSignerKey()
  if (!registrarAddress || !signerKey) return null

  const label = ensSubnameLabel(params.winnerSubname)
  if (!label) return null

  const deadline = Math.floor(Date.now() / 1000) + CLAIM_SIGNATURE_TTL_SECONDS
  const account = privateKeyToAccount(signerKey)

  const signature = await account.signTypedData({
    domain: {
      ...ENS_CLAIM_EIP712_DOMAIN,
      chainId: 1,
      verifyingContract: registrarAddress,
    },
    types: {
      Claim: [
        { name: 'raffleId', type: 'uint256' },
        { name: 'label', type: 'string' },
        { name: 'winner', type: 'address' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'Claim',
    message: {
      raffleId: BigInt(params.raffleId),
      label,
      winner: getAddress(params.winner),
      deadline: BigInt(deadline),
    },
  })

  return {
    raffleId: params.raffleId,
    label,
    winnerSubname: params.winnerSubname,
    deadline,
    signature,
    registrarAddress,
    chainId: 1,
  }
}
