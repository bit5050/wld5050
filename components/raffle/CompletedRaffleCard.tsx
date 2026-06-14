import Link from 'next/link'
import ENSName from '@/components/ens/ENSName'
import { getEnsDomainsUrl } from '@/lib/ens-claim/constants'
import ShareRaffleDialog from '@/components/raffle/ShareRaffleDialog'
import PaymentTokenBadge from '@/components/raffle/PaymentTokenBadge'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import { formatTokenAmount } from '@/lib/pricing'
import { getAddressTokenTransfersUrl, getTxTokenTransfersUrl } from '@/lib/share/raffle-share'
import type { CompletedRaffle } from '@/types'

type Props = {
  raffle: CompletedRaffle
  compact?: boolean
}

export default function CompletedRaffleCard({ raffle, compact = false }: Props) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white ${compact ? 'h-full' : ''}`}
    >
      <div
        className={`flex items-start justify-between gap-2 border-b border-[#E0E0E0] px-4 ${compact ? 'py-3' : 'py-3.5'}`}
      >
        <span
          className={`font-display font-medium tracking-tight text-black ${compact ? 'text-[14px] leading-snug line-clamp-2' : 'text-[15px]'}`}
        >
          {raffle.raffleName}
        </span>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <PaymentTokenBadge token={raffle.paymentToken} />
          <span className="rounded-full border border-[#E0E0E0] px-2 py-0.5 font-mono text-[10px] tracking-wide text-[#616161]">
            ● Settled
          </span>
        </div>
      </div>

      <div className={`flex flex-1 flex-col px-4 ${compact ? 'py-3' : 'py-4'}`}>
        <div className={`mb-3 text-[#616161] ${compact ? 'space-y-1 text-[11px] leading-relaxed' : 'text-[12px]'}`}>
          <p>
            Round{' '}
            <span className="font-mono font-bold text-black">#{raffle.raffleId}</span>
          </p>
          <p>
            Winner{' '}
            <span className="font-medium text-black">
              <ENSName address={raffle.winner} fallback={raffle.winnerEns ?? undefined} />
            </span>
          </p>
          <p className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
            <a
              href={getAddressTokenTransfersUrl(raffle.winner)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-[#9E9E9E] transition-colors hover:text-black"
            >
              Winner {raffle.paymentToken} ↗
            </a>
            <a
              href={getAddressTokenTransfersUrl(raffle.creator)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-[#9E9E9E] transition-colors hover:text-black"
            >
              Creator {raffle.paymentToken} ↗
            </a>
            {raffle.txHash ? (
              <a
                href={getTxTokenTransfersUrl(raffle.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-[#9E9E9E] transition-colors hover:text-black"
              >
                50/50 transfers ↗
              </a>
            ) : null}
          </p>
          {!compact && (
            <div className="pt-1">
              <VerifiedBadge label="World ID verified winner" />
            </div>
          )}
        </div>

        <div className={`mb-3 grid grid-cols-3 gap-2 ${compact ? '' : 'gap-3 mb-4'}`}>
          {[
            { label: 'Winner paid', value: formatTokenAmount(raffle.winnerPrize, raffle.paymentToken) },
            { label: 'Creator paid', value: formatTokenAmount(raffle.creatorPayout, raffle.paymentToken) },
            { label: 'Tickets sold', value: String(raffle.ticketsSold) },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-widest text-[#9E9E9E] leading-tight">
                {label}
              </span>
              <span className={`font-mono font-bold tracking-tight text-black ${compact ? 'text-[14px]' : 'text-[16px]'}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className={`mb-3 rounded-[7px] border-[0.5px] border-[#E0E0E0] px-3 py-2.5 ${compact ? '' : 'px-3.5'}`}>
          <p className="text-[9px] uppercase tracking-widest text-[#9E9E9E] mb-0.5">Winner ENS</p>
          {raffle.ensMinted ? (
            <Link
              href={getEnsDomainsUrl(raffle.winnerSubname)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] font-bold text-black truncate hover:text-[#616161]"
            >
              {raffle.winnerSubname} ↗
            </Link>
          ) : (
            <p className="font-mono text-[10px] font-bold text-black truncate">{raffle.winnerSubname}</p>
          )}
        </div>

        <div className="mt-auto space-y-2">
          <Link href={`/raffle/${raffle.raffleId}`}>
            <button
              type="button"
              className={`w-full rounded-[7px] border-[0.5px] border-[#E0E0E0] bg-white font-medium text-black transition-colors hover:border-black ${compact ? 'py-2.5 text-[13px]' : 'py-3 text-[14px]'}`}
            >
              View raffle →
            </button>
          </Link>
          <ShareRaffleDialog
            raffleId={raffle.raffleId}
            raffleName={raffle.raffleName}
            txHash={raffle.txHash || undefined}
            triggerClassName={compact ? 'py-2 text-[12px]' : undefined}
          />
        </div>
      </div>
    </div>
  )
}
