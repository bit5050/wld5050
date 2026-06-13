import HeroSection from '@/components/sections/HeroSection'
import DividerLabel from '@/components/ui/DividerLabel'
import RaffleCard from '@/components/raffle/RaffleCard'
import CreateCard from '@/components/raffle/CreateCard'
import WinnerCard from '@/components/raffle/WinnerCard'
import { Raffle, Settlement } from '@/types'

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

const MOCK_SETTLEMENT: Settlement = {
  raffleId: 41,
  winner: '0x9876543210987654321098765432109876543210',
  winnerEns: 'alice.eth',
  winnerSubname: 'winner-round41.wld5050.eth',
  winnerPrize: 312.50,
  creatorPayout: 312.50,
  txHash: '0x9a3cd12f',
  blockNumber: 28419203,
  creSteps: [
    { label: 'CRE cron triggered',  detail: 'Round #41 deadline passed', mono: 'block #28,419,203', status: 'done' },
    { label: 'AgentKit verified',   detail: 'agent.wld5050.eth confirmed human-backed by bit5050.eth', status: 'done' },
    { label: 'AI attestation',      detail: 'Round assessed fair', mono: '0xf3a1...b2c4', status: 'done' },
    { label: 'Randomness',          detail: 'DON consensus 15/15 nodes · winner index 187', status: 'done' },
    { label: 'Settlement complete', detail: '$312.50 → alice.eth · $312.50 → bit5050.eth', mono: 'tx 0x9a3c...d12f', status: 'done' },
  ],
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* ACTIVE RAFFLES */}
      <div id="raffles">
        <DividerLabel text="Active raffles" />
      </div>
      <section className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-baseline justify-between mb-5">
          <span className="font-display text-[13px] font-medium uppercase tracking-widest text-gray-400">Live now</span>
          <a href="/history" className="text-[12px] text-gray-400 hover:text-black transition-colors">View all →</a>
        </div>
        <div className="space-y-3">
          {MOCK_RAFFLES.map(r => <RaffleCard key={r.id} raffle={r} />)}
        </div>
      </section>

      {/* CREATE */}
      <DividerLabel text="Create a raffle" />
      <section className="px-6 py-6 border-b border-gray-200">
        <CreateCard />
      </section>

      {/* LAST SETTLEMENT */}
      <DividerLabel text="Last settlement" />
      <section className="px-6 py-6">
        <div className="flex items-baseline justify-between mb-5">
          <span className="font-display text-[13px] font-medium uppercase tracking-widest text-gray-400">Round 41 — settled</span>
        </div>
        <WinnerCard settlement={MOCK_SETTLEMENT} />
      </section>
    </>
  )
}
