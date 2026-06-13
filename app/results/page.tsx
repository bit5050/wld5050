import WinnerCard from '@/components/raffle/WinnerCard'
import { Settlement } from '@/types'

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

export default function ResultsPage() {
  return (
    <div className="px-6 py-10">
      <h1 className="font-display text-[28px] font-semibold tracking-tight mb-1">Results</h1>
      <p className="text-[13px] text-gray-600 mb-8 max-w-[480px]">
        Past raffle settlements verified and paid automatically by Chainlink CRE.
      </p>
      <WinnerCard settlement={MOCK_SETTLEMENT} />
    </div>
  )
}
