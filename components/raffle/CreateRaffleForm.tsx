'use client'

import { useMemo, useState } from 'react'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import {
  AGENT_ENS,
  PLATFORM_FEE,
  PLATFORM_WALLET,
  TICKET_PRICE,
} from '@/types'

type Props = {
  variant?: 'section' | 'page'
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toDateValue(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function toTimeValue(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatDateTime(date: string, time: string) {
  if (!date || !time) return 'Not set'
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const dt = new Date(y, m - 1, d, hh, mm)
  return dt.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export default function CreateRaffleForm({ variant = 'section' }: Props) {
  const defaultStart = useMemo(() => {
    const d = new Date()
    d.setMinutes(d.getMinutes() + 3)
    return d
  }, [])

  const defaultEnd = useMemo(() => {
    const d = new Date(defaultStart)
    d.setHours(d.getHours() + 24)
    return d
  }, [defaultStart])

  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(toDateValue(defaultStart))
  const [startTime, setStartTime] = useState(toTimeValue(defaultStart))
  const [endDate, setEndDate] = useState(toDateValue(defaultEnd))
  const [endTime, setEndTime] = useState(toTimeValue(defaultEnd))
  const [verified, setVerified] = useState(false)

  const canSubmit = verified && name.trim().length > 0

  return (
    <div
      className={
        variant === 'section'
          ? 'rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 sm:p-8'
          : 'max-w-[720px]'
      }
    >
      <div className="mb-6">
        <h3 className="font-display text-[22px] font-semibold tracking-tight text-black sm:text-[24px]">
          Create Your 50/50 Raffle
        </h3>
        <p className="mt-2 font-mono text-[13px] text-[#616161]">
          Creation payment:{' '}
          <span className="font-bold text-black">${PLATFORM_FEE.toFixed(2)} USDC</span>
        </p>
      </div>

      {/* Fee breakdown */}
      <div className="mb-6 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] p-4">
        <p className="font-mono text-[10px] text-[#9E9E9E] uppercase tracking-[0.2em] mb-3">
          Fee breakdown
        </p>
        <p className="font-body text-[13px] text-black mb-2">
          Creator pays:{' '}
          <span className="font-mono font-bold">${PLATFORM_FEE.toFixed(2)} USDC</span>
        </p>
        <ul className="space-y-1.5 font-mono text-[12px] text-[#616161]">
          <li>
            ${PLATFORM_FEE.toFixed(2)} → {PLATFORM_WALLET} platform creation fee
          </li>
        </ul>
      </div>

      <p className="mb-6 font-body text-[12px] leading-relaxed text-[#616161]">
        Please allow at least a 2-minute buffer between the current time and your selected start
        time. This helps avoid smart contract timing errors on World Chain.
      </p>

      {/* Verification status */}
      {!verified ? (
        <div className="mb-6 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-black px-4 py-4">
          <p className="font-display text-[14px] font-semibold text-white mb-1">
            World ID not verified
          </p>
          <p className="font-body text-[12px] text-[#9E9E9E]">
            Verify with World ID to create a raffle. One verified human per creator session.
          </p>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-2 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3">
          <VerifiedBadge label="World ID verified — ready to create" />
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-5 mb-6">
        <div>
          <label
            htmlFor="raffle-name"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]"
          >
            Raffle name
          </label>
          <input
            id="raffle-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter raffle name"
            className="w-full rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-3 font-body text-[14px] text-black outline-none transition-colors placeholder:text-[#BDBDBD] focus:border-black"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="start-date"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]"
            >
              Start date
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-3 font-mono text-[13px] text-black outline-none focus:border-black"
            />
          </div>
          <div>
            <label
              htmlFor="start-time"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]"
            >
              Start time
            </label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-3 font-mono text-[13px] text-black outline-none focus:border-black"
            />
          </div>
          <div>
            <label
              htmlFor="end-date"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]"
            >
              End date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-3 font-mono text-[13px] text-black outline-none focus:border-black"
            />
          </div>
          <div>
            <label
              htmlFor="end-time"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]"
            >
              End time
            </label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-3 font-mono text-[13px] text-black outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Live summary */}
      <div className="mb-6 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-4">
        <p className="font-display text-[14px] font-semibold text-black mb-3">Your Raffle Details:</p>
        <ul className="space-y-1.5 font-body text-[13px] text-[#616161]">
          <li>• Raffle Name: {name.trim() || 'Not set'}</li>
          <li>• Start: {formatDateTime(startDate, startTime)}</li>
          <li>• End: {formatDateTime(endDate, endTime)}</li>
        </ul>
      </div>

      {/* Important information */}
      <div className="mb-6 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] p-4">
        <p className="font-display text-[14px] font-semibold text-black mb-3">
          WLD5050 Important Information:
        </p>
        <ul className="space-y-2 font-body text-[12px] leading-relaxed text-[#616161]">
          <li>
            <strong className="text-black">Platform Creation Fee:</strong>{' '}
            <span className="font-mono">${PLATFORM_FEE.toFixed(2)} USDC</span> → {PLATFORM_WALLET}
          </li>
          <li>
            <strong className="text-black">Ticket Cost:</strong>{' '}
            <span className="font-mono">${TICKET_PRICE.toFixed(2)} USDC</span> per ticket
          </li>
          <li>
            <strong className="text-black">Prize Distribution:</strong> 50% to winner, 50% to
            creator. Both paid automatically in the same transaction.
          </li>
          <li>
            <strong className="text-black">Winner Selection:</strong> Chainlink CRE DON consensus
            ({AGENT_ENS}) with AI fairness attestation before every draw.
          </li>
          <li>
            <strong className="text-black">Entry Rule:</strong> One ticket per World ID verified
            human. Enforced onchain via ZK proof.
          </li>
          <li>
            <strong className="text-black">Operational Notes:</strong> No claiming step. No admin
            keeper. Settlement is fully automated on World Chain.
          </li>
        </ul>
      </div>

      {/* Actions */}
      {!verified ? (
        <button
          type="button"
          onClick={() => setVerified(true)}
          className="w-full rounded-[10px] border-[0.5px] border-black bg-white py-3.5 font-body text-[14px] font-medium text-black transition-colors hover:bg-[#FAFAFA]"
        >
          Verify with World ID to continue
        </button>
      ) : (
        <button
          type="button"
          disabled={!canSubmit}
          className="w-full rounded-[10px] bg-black py-3.5 font-body text-[14px] font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Pay ${PLATFORM_FEE.toFixed(2)} USDC &amp; create raffle
        </button>
      )}

      <p className="mt-4 text-center font-body text-[11px] leading-relaxed text-[#9E9E9E]">
        Creation fee is non-refundable. Ticket revenue held in escrow on World Chain. Chainlink CRE
        settles automatically when the raffle ends.
      </p>
    </div>
  )
}
