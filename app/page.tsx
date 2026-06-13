import HeroSection from '@/components/sections/HeroSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import CreateRaffleSection from '@/components/sections/CreateRaffleSection'
import ActiveRafflesSection from '@/components/sections/ActiveRafflesSection'
import TrustSection from '@/components/sections/TrustSection'
import DividerLabel from '@/components/ui/DividerLabel'
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
  {
    id: 3,
    name: 'World Chain Dev Meetup Pot',
    creator: '0x9876543210987654321098765432109876543210',
    creatorEns: 'agent.wld5050.eth',
    ticketsSold: 156,
    endTime: Math.floor(Date.now() / 1000) + 60480,
    status: 'ACTIVE',
  },
  {
    id: 4,
    name: 'Base Camp Builder Pot',
    creator: '0x1111111111111111111111111111111111111111',
    creatorEns: 'wld5050.eth',
    ticketsSold: 312,
    endTime: Math.floor(Date.now() / 1000) + 72000,
    status: 'ACTIVE',
  },
  {
    id: 5,
    name: 'ZK Hackathon Prize Split',
    creator: '0x2222222222222222222222222222222222222222',
    creatorEns: 'winner-round40.wld5050.eth',
    ticketsSold: 91,
    endTime: Math.floor(Date.now() / 1000) + 54000,
    status: 'ACTIVE',
  },
  {
    id: 6,
    name: 'Community Grants Round 12',
    creator: '0x3333333333333333333333333333333333333333',
    creatorEns: 'bit5050.eth',
    ticketsSold: 178,
    endTime: Math.floor(Date.now() / 1000) + 86400,
    status: 'ACTIVE',
  },
  {
    id: 7,
    name: 'Devcon Side Event Pot',
    creator: '0x4444444444444444444444444444444444444444',
    creatorEns: 'alice.eth',
    ticketsSold: 203,
    endTime: Math.floor(Date.now() / 1000) + 96000,
    status: 'ACTIVE',
  },
  {
    id: 8,
    name: 'Open Source Maintainer Fund',
    creator: '0x5555555555555555555555555555555555555555',
    creatorEns: 'agent.wld5050.eth',
    ticketsSold: 64,
    endTime: Math.floor(Date.now() / 1000) + 48000,
    status: 'ACTIVE',
  },
  {
    id: 9,
    name: 'World ID Meetup NYC',
    creator: '0x6666666666666666666666666666666666666666',
    creatorEns: 'wld5050.eth',
    ticketsSold: 129,
    endTime: Math.floor(Date.now() / 1000) + 68000,
    status: 'ACTIVE',
  },
]

const MOCK_SETTLEMENT: Settlement = {
  raffleId: 41,
  winner: '0x9876543210987654321098765432109876543210',
  winnerEns: 'alice.eth',
  winnerSubname: 'winner-round41.wld5050.eth',
  winnerPrize: 312.5,
  creatorPayout: 312.5,
  txHash: '0x9a3cd12f',
  blockNumber: 28419203,
  creSteps: [
    { label: 'CRE cron triggered', detail: 'Round #41 deadline passed', mono: 'block #28,419,203', status: 'done' },
    { label: 'AgentKit verified', detail: 'agent.wld5050.eth confirmed human-backed by bit5050.eth', status: 'done' },
    { label: 'AI attestation', detail: 'Round assessed fair', mono: '0xf3a1...b2c4', status: 'done' },
    { label: 'Randomness', detail: 'DON consensus 15/15 nodes · winner index 187', status: 'done' },
    { label: 'Settlement complete', detail: '$312.50 → alice.eth · $312.50 → bit5050.eth', mono: 'tx 0x9a3c...d12f', status: 'done' },
  ],
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <TrustSection />
      <CreateRaffleSection />
      <ActiveRafflesSection raffles={MOCK_RAFFLES} />

      <DividerLabel text="Completed Raffle Results" />
      <section className="px-6 py-6">
        <div className="flex items-baseline justify-between mb-5">
          <span className="font-display text-[13px] font-medium uppercase tracking-widest text-[#9E9E9E]">
            Round 41 — settled
          </span>
        </div>
        <WinnerCard settlement={MOCK_SETTLEMENT} />
      </section>
    </>
  )
}
