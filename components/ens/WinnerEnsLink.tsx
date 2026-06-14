'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import WinnerEnsClaimButton from '@/components/ens/WinnerEnsClaimButton'
import { getEnsDomainsUrl } from '@/lib/ens-claim/constants'
import { isEnsClaimedOnRegistrar } from '@/lib/ens/fetch-ens-minted'

type Props = {
  raffleId: number
  winner: `0x${string}`
  winnerSubname: string
  ensMinted: boolean
  onEnsClaimed?: () => void
}

export default function WinnerEnsLink({
  raffleId,
  winner,
  winnerSubname,
  ensMinted,
  onEnsClaimed,
}: Props) {
  const [minted, setMinted] = useState(ensMinted)

  useEffect(() => {
    setMinted(ensMinted)
  }, [ensMinted])

  useEffect(() => {
    if (minted) return
    void isEnsClaimedOnRegistrar(raffleId).then((claimed) => {
      if (claimed) setMinted(true)
    })
  }, [minted, raffleId])

  const handleClaimed = useCallback(() => {
    setMinted(true)
    onEnsClaimed?.()
  }, [onEnsClaimed])

  return (
    <div className="rounded-[8px] border border-gray-100 px-4 py-3">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">
        Winner ENS badge
      </p>

      {minted ? (
        <>
          <Link
            href={getEnsDomainsUrl(winnerSubname)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] font-bold text-black transition-colors hover:text-[#616161]"
          >
            {winnerSubname} ↗
          </Link>
          <p className="mt-1 text-[11px] text-gray-500">
            Live on Ethereum — resolves to the winner&apos;s address.
          </p>
        </>
      ) : (
        <>
          <Link
            href={getEnsDomainsUrl(winnerSubname)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] font-bold text-black transition-colors hover:text-[#616161]"
          >
            {winnerSubname} ↗
          </Link>
          <p className="mt-1 text-[11px] text-gray-500">
            Optional trophy name on Ethereum L1. Winners claim it themselves and pay mainnet
            gas. Payout proof stays on Worldscan above.
          </p>
          <WinnerEnsClaimButton
            raffleId={raffleId}
            winner={winner}
            winnerSubname={winnerSubname}
            ensMinted={minted}
            onClaimed={handleClaimed}
          />
        </>
      )}
    </div>
  )
}
