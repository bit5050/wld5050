'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Raffle, TICKET_PRICE } from '@/types'
import { formatCountdown } from '@/lib/format'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import ENSName from '@/components/ens/ENSName'

interface Props { raffle: Raffle }

export default function RaffleCard({ raffle }: Props) {
  const [tickets, setTickets] = useState(raffle.ticketsSold)
  const [animate, setAnimate] = useState(false)
  const [countdown, setCountdown] = useState(formatCountdown(raffle.endTime))

  const prizePool  = (tickets * TICKET_PRICE).toFixed(2)
  const yourShare  = (tickets * TICKET_PRICE / 2).toFixed(2)

  useEffect(() => {
    const t = setInterval(() => setCountdown(formatCountdown(raffle.endTime)), 30000)
    return () => clearInterval(t)
  }, [raffle.endTime])

  useEffect(() => {
    if (raffle.status !== 'ACTIVE') return
    const t = setInterval(() => {
      if (Math.random() > 0.5) {
        setAnimate(true)
        setTimeout(() => setAnimate(false), 350)
        setTickets(n => n + 1)
      }
    }, 3000)
    return () => clearInterval(t)
  }, [raffle.status])

  return (
    <div className="border border-gray-200 rounded-[10px] overflow-hidden">
      <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <span className="font-display text-[15px] font-medium tracking-tight">{raffle.name}</span>
        <span className="font-mono text-[10px] tracking-wide px-2.5 py-1 rounded-full border border-black text-black">
          ● Live
        </span>
      </div>
      <div className="px-4 py-4">
        <div className="flex items-center gap-1.5 text-[12px] text-gray-600 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block flex-shrink-0" />
          <span>Created by{' '}
            <span className="text-black font-medium">
              <ENSName address={raffle.creator} fallback={raffle.creatorEns ?? undefined} />
            </span>
          </span>
          <span className="text-gray-300 mx-1">·</span>
          <span>Ends in <strong className="text-black">{countdown}</strong></span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Tickets sold', value: <span className={`font-mono text-[16px] font-bold tracking-tight transition-opacity ${animate ? 'opacity-0' : 'opacity-100'}`}>{tickets}</span> },
            { label: 'Prize pool',   value: <span className="font-mono text-[16px] font-bold tracking-tight text-green-600">${prizePool}</span> },
            { label: 'Your share',   value: <span className="font-mono text-[16px] font-bold tracking-tight">${yourShare}</span> },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">{label}</span>
              {value}
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
            <span>{tickets} humans entered</span>
            <span>No cap</span>
          </div>
          <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full transition-all duration-500"
              style={{ width: `${Math.min((tickets / 500) * 100, 100)}%` }} />
          </div>
        </div>
        <Link href={`/raffle/${raffle.id}`}>
          <button className="w-full text-[14px] font-medium py-3 bg-black text-white rounded-[7px] hover:opacity-80 transition-opacity">
            Buy ticket{' '}
            <span className="font-mono text-[13px] opacity-70">$2.50 USDC</span>
          </button>
        </Link>
      </div>
    </div>
  )
}
