'use client'
import { useState } from 'react'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import { PLATFORM_FEE, TICKET_PRICE } from '@/types'

export default function CreatePage() {
  const [name, setName]         = useState('')
  const [duration, setDuration] = useState('24')
  const [verified, setVerified] = useState(false)

  const durations = [
    { label: '24 hours', value: '24' },
    { label: '48 hours', value: '48' },
    { label: '7 days',   value: '168' },
  ]

  return (
    <div className="px-6 py-10 max-w-[520px]">
      <a href="/" className="text-[12px] text-gray-400 hover:text-black transition-colors mb-6 inline-block">
        ← Back
      </a>
      <h1 className="font-display text-[28px] font-semibold tracking-tight mb-1">Create a raffle</h1>
      <p className="text-[13px] text-gray-600 mb-8">
        Pay the creation fee, set your raffle details, and go live. Chainlink CRE handles everything else.
      </p>

      <div className="space-y-4">
        {/* NAME */}
        <div>
          <label className="block text-[11px] text-gray-400 uppercase tracking-widest mb-2">Raffle name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. ETHGlobal NYC Community Pot"
            className="w-full px-4 py-3 text-[14px] border border-gray-200 rounded-[7px] outline-none focus:border-black transition-colors font-body placeholder:text-gray-300"
          />
        </div>

        {/* DURATION */}
        <div>
          <label className="block text-[11px] text-gray-400 uppercase tracking-widest mb-2">Duration</label>
          <div className="grid grid-cols-3 gap-2">
            {durations.map(d => (
              <button
                key={d.value}
                onClick={() => setDuration(d.value)}
                className={`py-3 text-[13px] font-medium rounded-[7px] border transition-colors ${
                  duration === d.value
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-200 hover:border-black'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* FEE SUMMARY */}
        <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-4 space-y-2">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-3">Summary</p>
          {[
            { label: 'Creation fee (one-time)',  value: `$${PLATFORM_FEE.toFixed(2)} USDC` },
            { label: 'Ticket price (buyers pay)', value: `$${TICKET_PRICE.toFixed(2)} USDC` },
            { label: 'Your payout when raffle ends', value: '50% of ticket revenue' },
            { label: 'Winner payout (auto)',     value: '50% of ticket revenue' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
              <span className="text-[12px] text-gray-600">{label}</span>
              <span className="font-mono text-[12px] font-bold">{value}</span>
            </div>
          ))}
        </div>

        {/* WORLD ID STEP */}
        {!verified ? (
          <button
            onClick={() => setVerified(true)}
            className="w-full py-3.5 text-[14px] font-medium border border-gray-200 rounded-[7px] hover:border-black transition-colors flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Verify with World ID to continue
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-4 py-3 border border-gray-100 rounded-[7px] bg-gray-50">
              <VerifiedBadge label="World ID verified — ready to create" />
            </div>
            <button
              disabled={!name}
              className="w-full py-3.5 text-[14px] font-medium bg-black text-white rounded-[7px] hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Pay $10.00 USDC & create raffle
            </button>
          </div>
        )}

        <p className="text-[11px] text-gray-400 text-center leading-relaxed">
          Creation fee is non-refundable. Ticket revenue held in escrow on World Chain.
          <br />Chainlink CRE settles automatically when the raffle ends.
        </p>
      </div>
    </div>
  )
}
