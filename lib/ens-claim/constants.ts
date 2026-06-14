/** Ethereum L1 WinnerEnsClaimRegistrar — winner self-serve ENS badge claims. */

export const ENS_NAME_WRAPPER = '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401' as const
export const ENS_PUBLIC_RESOLVER = '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63' as const
export const WLD5050_ETH_PARENT = 'wld5050.eth' as const

export const ENS_CLAIM_EIP712_DOMAIN = {
  name: 'WLD5050 Winner ENS',
  version: '1',
} as const

export const winnerEnsClaimRegistrarAbi = [
  {
    type: 'function',
    name: 'claim',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'raffleId', type: 'uint256' },
      { name: 'label', type: 'string' },
      { name: 'deadline', type: 'uint256' },
      { name: 'signature', type: 'bytes' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'claimed',
    stateMutability: 'view',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'event',
    name: 'WinnerBadgeClaimed',
    inputs: [
      { name: 'raffleId', type: 'uint256', indexed: true },
      { name: 'winner', type: 'address', indexed: true },
      { name: 'label', type: 'string', indexed: false },
    ],
  },
] as const

/** "winner-round2.wld5050.eth" → "winner-round2" */
export function ensSubnameLabel(fullName: string): string {
  const trimmed = fullName.trim()
  if (!trimmed) return ''
  return trimmed.split('.')[0] ?? trimmed
}

/** Production WinnerEnsClaimRegistrar on Ethereum mainnet (ENS registry v2). */
export const WINNER_ENS_CLAIM_REGISTRAR_ADDRESS =
  '0xef9ad4bd204eace9d2b2a0f53326c7e83e8c49f9' as const

export function getWinnerEnsClaimRegistrarAddress(): `0x${string}` | null {
  const raw = process.env.NEXT_PUBLIC_WINNER_ENS_CLAIM_REGISTRAR?.trim()
  if (raw && /^0x[a-fA-F0-9]{40}$/.test(raw)) {
    return raw as `0x${string}`
  }
  return WINNER_ENS_CLAIM_REGISTRAR_ADDRESS
}

export function getEnsRegistrarEtherscanUrl(
  address: `0x${string}` = WINNER_ENS_CLAIM_REGISTRAR_ADDRESS,
): string {
  return `https://etherscan.io/address/${address}`
}

export function getEnsDomainsUrl(fullName: string): string {
  return `https://app.ens.domains/${encodeURIComponent(fullName.trim())}`
}
