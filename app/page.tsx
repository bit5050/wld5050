import StatCard from '@/components/ui/StatCard'
import DividerLabel from '@/components/ui/DividerLabel'
import BalancedText from '@/components/ui/balanced-text'
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
      {/* HERO */}
      <section className="px-6 pt-12 pb-10 border-b border-gray-200">
        <p className="font-mono text-[11px] text-gray-400 tracking-widest uppercase mb-4">
          World Chain · Human-verified · Automated
        </p>
        <BalancedText as="h1" className="font-display text-[38px] font-semibold leading-[1.15] tracking-tight mb-4">
          Fair raffles.
          <span className="text-gray-400"> No bots. No bias.</span>
          {' '}No middlemen.
        </BalancedText>
        <p className="text-[14px] text-gray-600 leading-relaxed max-w-[480px] mb-8">
          Create or enter a 50/50 raffle. One ticket per verified human.
          Winners selected by Chainlink CRE and paid automatically — no claiming, no waiting.
        </p>
        <div className="flex gap-3 flex-wrap">
          <a href="/create">
            <button className="text-[14px] font-medium px-6 py-3 bg-black text-white rounded-md hover:opacity-80 transition-opacity">
              Create a raffle
            </button>
          </a>
          <a href="#raffles">
            <button className="text-[14px] font-medium px-6 py-3 bg-white text-black border border-gray-200 rounded-md hover:border-black transition-colors">
              Browse active raffles
            </button>
          </a>
        </div>
        <div className="flex gap-8 mt-10 pt-8 border-t border-gray-100">
          <StatCard label="Per ticket"      value="$2.50" />
          <StatCard label="Winner payout"   value="50%" />
          <StatCard label="Creator payout"  value="50%" />
          <StatCard label="Claiming steps"  value="0" />
        </div>
      </section>

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
