'use client'
import { useState, useEffect } from 'react'
import { TICKET_PRICE } from '@/types'
import { formatCountdown } from '@/lib/format'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import ENSName from '@/components/ens/ENSName'

export default function RafflePage({ params }: { params: { id: string } }) {
  const [tickets, setTickets]   = useState(247)
  const [verified, setVerified] = useState(false)
  const [entered, setEntered]   = useState(false)
  const endTime = Math.floor(Date.now() / 1000) + 42120

  const prizePool  = (tickets * TICKET_PRICE).toFixed(2)
  const yourShare  = (tickets * TICKET_PRICE / 2).toFixed(2)
  const [countdown, setCountdown] = useState<string | null>(null)

  useEffect(() => {
    const update = () => setCountdown(formatCountdown(endTime))
    update()
    const t = setInterval(() => {
      update()
      if (Math.random() > 0.5) setTickets(n => n + 1)
    }, 3000)
    return () => clearInterval(t)
  }, [endTime])

  return (
    <div className="px-6 py-10">
      <a href="/" className="text-[12px] text-gray-400 hover:text-black transition-colors mb-6 inline-block">
        ← All raffles
      </a>

      {/* HEADER */}
      <div className="flex items-start justify-between mb-2">
        <h1 className="font-display text-[26px] font-semibold tracking-tight leading-tight">
          ETHGlobal NYC Community Pot
        </h1>
        <span className="font-mono text-[10px] px-2.5 py-1 border border-black rounded-full ml-4 mt-1 flex-shrink-0">
          ● Live
        </span>
      </div>
      <div className="flex items-center gap-2 text-[12px] text-gray-600 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        <span>Created by{' '}
          <span className="font-mono text-black font-medium">bit5050.eth</span>
        </span>
        <span className="text-gray-300">·</span>
        <span>Ends in <strong className="text-black">{countdown ?? '…'}</strong></span>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-100">
        {[
          { label: 'Tickets sold', value: String(tickets), mono: true },
          { label: 'Prize pool',   value: `$${prizePool}`, green: true },
          { label: 'Winner gets',  value: `$${yourShare}` },
        ].map(({ label, value, mono, green }) => (
          <div key={label}>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
            <p className={`font-mono text-[22px] font-bold tracking-tight ${green ? 'text-green-600' : ''}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div className="mb-8">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-4">How it works</p>
        <div className="space-y-2">
          {[
            { step: '01', text: 'Verify with World ID — proves you are a unique human' },
            { step: '02', text: 'Buy 1 ticket for $2.50 USDC — one per verified human' },
            { step: '03', text: 'Wait for the raffle to end — Chainlink CRE runs the draw automatically' },
            { step: '04', text: 'If you win, USDC arrives in your wallet automatically — no claiming needed' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
              <span className="font-mono text-[11px] text-gray-400 flex-shrink-0 mt-0.5">{step}</span>
              <span className="text-[13px] text-gray-600">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BUY */}
      {entered ? (
        <div className="border border-gray-200 rounded-[10px] p-5 text-center">
          <VerifiedBadge label="You're entered — good luck" />
          <p className="text-[12px] text-gray-600 mt-3">
            You will receive USDC automatically if you win. No action needed.
          </p>
        </div>
      ) : !verified ? (
        <button
          onClick={() => setVerified(true)}
          className="w-full py-3.5 text-[14px] font-medium border border-gray-200 rounded-[7px] hover:border-black transition-colors flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Verify with World ID to enter
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-4 py-3 border border-gray-100 rounded-[7px] bg-gray-50">
            <VerifiedBadge label="World ID verified" />
          </div>
          <button
            onClick={() => setEntered(true)}
            className="w-full py-3.5 text-[14px] font-medium bg-black text-white rounded-[7px] hover:opacity-80 transition-opacity"
          >
            Buy ticket —{' '}
            <span className="font-mono text-[13px] opacity-70">$2.50 USDC</span>
          </button>
        </div>
      )}

      <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
        One entry per World ID verified human · Powered by Chainlink CRE · wld5050.eth
      </p>
    </div>
  )
}
