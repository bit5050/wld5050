'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Raffle } from '@/types'
import { formatCountdown } from '@/lib/format'
import { formatPrizePool, formatWinnerShare, ticketPriceLabel } from '@/lib/pricing'
import ENSName from '@/components/ens/ENSName'
import ShareRaffleDialog from '@/components/raffle/ShareRaffleDialog'
import PaymentTokenBadge from '@/components/raffle/PaymentTokenBadge'

interface Props {
  raffle: Raffle
  compact?: boolean
}

export default function RaffleCard({ raffle, compact = false }: Props) {
  const [countdown, setCountdown] = useState<string | null>(null)

  const tickets = raffle.ticketsSold
  const prizePool = formatPrizePool(tickets, raffle.paymentToken)
  const yourShare = formatWinnerShare(tickets, raffle.paymentToken)

  useEffect(() => {
    const update = () => setCountdown(formatCountdown(raffle.endTime))
    update()
    const t = setInterval(update, 30000)
    return () => clearInterval(t)
  }, [raffle.endTime])

  return (
    <div className={`border-[0.5px] border-[#E0E0E0] rounded-[10px] overflow-hidden bg-white flex flex-col ${compact ? 'h-full' : ''}`}>
      <div className={`px-4 border-b border-[#E0E0E0] flex items-start justify-between gap-2 ${compact ? 'py-3' : 'py-3.5'}`}>
        <span className={`font-display font-medium tracking-tight text-black ${compact ? 'text-[14px] leading-snug line-clamp-2' : 'text-[15px]'}`}>
          {raffle.name}
        </span>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <PaymentTokenBadge token={raffle.paymentToken} />
          <span className="font-mono text-[10px] tracking-wide px-2 py-0.5 rounded-full border border-black text-black">
            ● Live
          </span>
        </div>
      </div>
      <div className={`px-4 flex flex-col flex-1 ${compact ? 'py-3' : 'py-4'}`}>
        <div className={`text-[#616161] mb-3 ${compact ? 'text-[11px] leading-relaxed space-y-1' : 'flex items-center gap-1.5 text-[12px] mb-4'}`}>
          {compact ? (
            <>
              <p>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] inline-block mr-1.5 align-middle" />
                By{' '}
                <span className="text-black font-medium">
                  <ENSName address={raffle.creator} fallback={raffle.creatorEns ?? undefined} />
                </span>
              </p>
              <p>
                Ends in <strong className="text-black font-mono">{countdown ?? '…'}</strong>
              </p>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] inline-block flex-none" />
              <span>Created by{' '}
                <span className="text-black font-medium">
                  <ENSName address={raffle.creator} fallback={raffle.creatorEns ?? undefined} />
                </span>
              </span>
              <span className="text-gray-300 mx-1">·</span>
              <span>Ends in <strong className="text-black">{countdown ?? '…'}</strong></span>
            </>
          )}
        </div>
        <div className={`grid gap-2 mb-3 ${compact ? 'grid-cols-3' : 'grid-cols-3 gap-3 mb-4'}`}>
          {[
            { label: 'Tickets sold', value: <span className={`font-mono font-bold tracking-tight text-black ${compact ? 'text-[14px]' : 'text-[16px]'}`}>{tickets}</span> },
            { label: 'Prize pool',   value: <span className={`font-mono font-bold tracking-tight text-black ${compact ? 'text-[14px]' : 'text-[16px]'}`}>{prizePool}</span> },
            { label: 'Your share',   value: <span className={`font-mono font-bold tracking-tight ${compact ? 'text-[14px]' : 'text-[16px]'}`}>{yourShare}</span> },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[9px] text-[#9E9E9E] uppercase tracking-widest leading-tight">{label}</span>
              {value}
            </div>
          ))}
        </div>
        <div className={compact ? 'mb-3' : 'mb-4'}>
          <div className="flex justify-between text-[10px] text-[#9E9E9E] mb-1.5">
            <span>{tickets} entered</span>
            <span>No cap</span>
          </div>
          <div className="h-[3px] bg-[#E0E0E0] rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full transition-all duration-500"
              style={{ width: `${Math.min((tickets / 500) * 100, 100)}%` }} />
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-1.5">
          <Link href={`/raffle/${raffle.id}`}>
            <button className={`flex w-full items-center justify-center gap-2 font-medium bg-black text-white rounded-[7px] hover:opacity-80 transition-opacity ${compact ? 'text-[13px] py-2.5' : 'text-[14px] py-3'}`}>
              Buy ticket
              <span className="inline-flex items-center gap-1.5 font-mono opacity-90">
                <PaymentTokenBadge token={raffle.paymentToken} showLabel={false} className="border-white/20 bg-white/10" />
                {ticketPriceLabel(raffle.paymentToken)}
              </span>
            </button>
          </Link>
          <Link href={`/raffle/${raffle.id}`}>
            <button
              type="button"
              className={`w-full rounded-[7px] border border-black bg-black font-medium text-white transition-opacity hover:opacity-80 ${compact ? 'py-2.5 text-[13px]' : 'py-3 text-[14px]'}`}
            >
              View raffle →
            </button>
          </Link>
          <ShareRaffleDialog
            raffleId={raffle.id}
            raffleName={raffle.name}
            triggerClassName={
              compact
                ? 'border-black bg-black py-2 text-[12px] text-white hover:opacity-80'
                : 'border-black bg-black text-white hover:opacity-80'
            }
          />
        </div>
      </div>
    </div>
  )
}
