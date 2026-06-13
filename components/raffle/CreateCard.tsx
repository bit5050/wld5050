'use client'
import Link from 'next/link'

export default function CreateCard() {
  return (
    <div className="border border-gray-200 rounded-[10px] p-5 bg-gray-50">
      <p className="font-display text-[14px] font-medium mb-1.5">Start your own raffle</p>
      <p className="text-[12px] text-gray-600 leading-relaxed mb-4">
        Set a name and duration. Any World ID verified human can buy a ticket. Chainlink CRE selects the winner and pays both you and the winner automatically.
      </p>
      <div className="space-y-2 mb-3">
        {[
          { label: 'Platform creation fee', value: '$10.00 USDC' },
          { label: 'Ticket price (fixed)',   value: '$2.50 USDC' },
          { label: 'Your payout',            value: '50% of ticket revenue' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-3.5 py-3 bg-white border border-gray-200 rounded-[7px]">
            <span className="text-[12px] text-gray-600">{label}</span>
            <span className="font-mono text-[13px] font-bold">{value}</span>
          </div>
        ))}
      </div>
      <Link href="/create">
        <button className="w-full text-[14px] font-medium py-3 bg-white text-black border border-gray-200 rounded-[7px] hover:border-black transition-colors">
          Create raffle — verify with World ID first
        </button>
      </Link>
    </div>
  )
}
