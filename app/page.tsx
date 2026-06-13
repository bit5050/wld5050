import HeroSection from '@/components/sections/HeroSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import CreateRaffleSection from '@/components/sections/CreateRaffleSection'
import ActiveRafflesSection from '@/components/sections/ActiveRafflesSection'
import CompletedRafflesSection from '@/components/sections/CompletedRafflesSection'
import TrustSection from '@/components/sections/TrustSection'
import { CompletedRaffle, Raffle } from '@/types'

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

const MOCK_COMPLETED_RAFFLES: CompletedRaffle[] = [
  {
    raffleId: 41,
    raffleName: 'ETHGlobal NYC Community Pot',
    ticketsSold: 250,
    winner: '0x9876543210987654321098765432109876543210',
    winnerEns: 'alice.eth',
    winnerSubname: 'winner-round41.wld5050.eth',
    winnerPrize: 312.5,
    creatorPayout: 312.5,
    txHash: '0x9a3cd12f',
    blockNumber: 28419203,
    creSteps: [],
  },
  {
    raffleId: 40,
    raffleName: 'Weekend Builder Fund',
    ticketsSold: 168,
    winner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    winnerEns: 'bit5050.eth',
    winnerSubname: 'winner-round40.wld5050.eth',
    winnerPrize: 210.0,
    creatorPayout: 210.0,
    txHash: '0x8b2ac91e',
    blockNumber: 28418801,
    creSteps: [],
  },
  {
    raffleId: 39,
    raffleName: 'ZK Hackathon Prize Split',
    ticketsSold: 96,
    winner: '0x2222222222222222222222222222222222222222',
    winnerEns: 'agent.wld5050.eth',
    winnerSubname: 'winner-round39.wld5050.eth',
    winnerPrize: 120.0,
    creatorPayout: 120.0,
    txHash: '0x7c1bd80a',
    blockNumber: 28418112,
    creSteps: [],
  },
]

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CreateRaffleSection />
      <HowItWorksSection />
      <TrustSection />
      <ActiveRafflesSection raffles={MOCK_RAFFLES} />
      <CompletedRafflesSection raffles={MOCK_COMPLETED_RAFFLES} />
    </>
  )
}
