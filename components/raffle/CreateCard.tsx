'use client'

import Link from 'next/link'
import {
  PLATFORM_FEE_DUAL_LABEL,
  TICKET_PRICE_DUAL_LABEL,
} from '@/lib/pricing'

type Props = {
  featured?: boolean
}

export default function CreateCard({ featured = false }: Props) {
  return (
    <div
      className={
        featured
          ? 'rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 sm:p-7'
          : 'border border-gray-200 rounded-[10px] p-5 bg-gray-50'
      }
    >
      <p className="font-display text-[14px] font-medium mb-1.5 text-black">
        Start your own raffle
      </p>
      <p className="text-[12px] text-[#616161] leading-relaxed mb-4 sm:text-[13px]">
        Set a name and duration. Any World ID verified human can buy a ticket. Chainlink CRE selects
        the winner and pays both you and the winner automatically.
      </p>
      <div className="space-y-2 mb-3">
        {[
          { label: 'Platform creation fee', value: PLATFORM_FEE_DUAL_LABEL },
          { label: 'Ticket price (fixed)', value: TICKET_PRICE_DUAL_LABEL },
          { label: 'Your payout', value: '50% of ticket revenue' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between px-3.5 py-3 bg-white border-[0.5px] border-[#E0E0E0] rounded-[7px]"
          >
            <span className="text-[12px] text-[#616161]">{label}</span>
            <span className="font-mono text-[13px] font-bold text-black">{value}</span>
          </div>
        ))}
      </div>
      <Link href="/create">
        <button
          className={
            featured
              ? 'w-full text-[14px] font-medium py-3.5 bg-black text-white rounded-[10px] hover:opacity-80 transition-opacity'
              : 'w-full text-[14px] font-medium py-3 bg-white text-black border border-gray-200 rounded-[7px] hover:border-black transition-colors'
          }
        >
          Create raffle — verify with World ID first
        </button>
      </Link>
    </div>
  )
}
