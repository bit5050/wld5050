import Link from 'next/link'
import WinnerEnsClaimButton from '@/components/ens/WinnerEnsClaimButton'
import { getEnsDomainsUrl } from '@/lib/ens-claim/constants'

type Props = {
  raffleId: number
  winner: `0x${string}`
  winnerSubname: string
  ensMinted: boolean
}

export default function WinnerEnsLink({
  raffleId,
  winner,
  winnerSubname,
  ensMinted,
}: Props) {
  return (
    <div className="rounded-[8px] border border-gray-100 px-4 py-3">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">
        Winner ENS badge
      </p>

      {ensMinted ? (
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
          <p className="font-mono text-[12px] font-bold text-black">{winnerSubname}</p>
          <p className="mt-1 text-[11px] text-gray-500">
            Optional trophy name on Ethereum L1. Winners claim it themselves and pay mainnet
            gas (~$1–15). Payout proof stays on Worldscan above.
          </p>
          <WinnerEnsClaimButton
            raffleId={raffleId}
            winner={winner}
            ensMinted={ensMinted}
          />
        </>
      )}
    </div>
  )
}
