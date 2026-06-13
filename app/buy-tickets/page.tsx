import Link from 'next/link'
import RaffleCard from '@/components/raffle/RaffleCard'
import { Raffle } from '@/types'

const MOCK_RAFFLES: Raffle[] = [
  {
    id: 1,
    name: 'ETHGlobal NYC Community Pot',
    creator: '0x1234567890123456789012345678901234567890',
    creatorEns: 'bit5050.eth',
    ticketsSold: 247,
    endTime: Math.floor(Date.now() / 1000) + 42120,
    status: 'ACTIVE',
  },
  {
    id: 2,
    name: 'Weekend Builder Fund',
    creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    creatorEns: 'alice.eth',
    ticketsSold: 84,
    endTime: Math.floor(Date.now() / 1000) + 83280,
    status: 'ACTIVE',
  },
]

export default function BuyTicketsPage() {
  return (
    <div className="px-6 py-10">
      <h1 className="font-display text-[28px] font-semibold tracking-tight mb-1">Buy Tickets</h1>
      <p className="text-[13px] text-gray-600 mb-8 max-w-[480px]">
        One ticket per verified human. Pick an active raffle below to enter.
      </p>
      <div className="space-y-3">
        {MOCK_RAFFLES.map((raffle) => (
          <RaffleCard key={raffle.id} raffle={raffle} />
        ))}
      </div>
      <Link
        href="/"
        className="inline-block mt-6 text-[12px] text-gray-400 hover:text-black transition-colors"
      >
        ← Back to home
      </Link>
    </div>
  )
}
