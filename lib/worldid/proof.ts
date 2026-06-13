import type { IDKitResult, ResponseItemV3 } from '@worldcoin/idkit'
import { decodeAbiParameters } from 'viem'

export type LegacyWorldIdProof = {
  root: bigint
  nullifierHash: bigint
  proof: readonly [
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
  ]
}

function isV3Response(item: IDKitResult['responses'][number]): item is ResponseItemV3 {
  return 'merkle_root' in item
}

/** Parse a World ID 3.0 Orb proof for WLD5050.verifyProof on-chain calls. */
export function extractLegacyOrbProof(result: IDKitResult): LegacyWorldIdProof {
  if (result.protocol_version !== '3.0') {
    throw new Error(
      'On-chain WLD5050 requires a World ID 3.0 legacy Orb proof. Use orbLegacy with allow_legacy_proofs.',
    )
  }

  const response =
    result.responses.find((item) => item.identifier === 'orb') ??
    result.responses.find(isV3Response)

  if (!response || !isV3Response(response)) {
    throw new Error('World ID response did not include an Orb legacy proof.')
  }

  const proof = decodeAbiParameters(
    [{ type: 'uint256[8]' }],
    response.proof as `0x${string}`,
  )[0]

  return {
    root: BigInt(response.merkle_root),
    nullifierHash: BigInt(response.nullifier),
    proof,
  }
}
