import type { Metadata } from 'next'
import Link from 'next/link'
import RaffleCard from '@/components/raffle/RaffleCard'
import ContractAddressLink from '@/components/raffle/ContractAddressLink'
import { fetchRafflesFromContract } from '@/lib/contracts/fetch-raffles'

export const metadata: Metadata = {
  title: 'Buy Tickets World Chain WLD Raffle',
  description: 'Buy Tickets World Chain WLD Raffle , Create World ID 50/50 Raffle',
  openGraph: {
    title: 'Buy Tickets World Chain WLD Raffle',
    description: 'Buy Tickets World Chain WLD Raffle , Create World ID 50/50 Raffle',
  },
  twitter: {
    title: 'Buy Tickets World Chain WLD Raffle',
    description: 'Buy Tickets World Chain WLD Raffle , Create World ID 50/50 Raffle',
  },
}

export const revalidate = 30

export default async function BuyTicketsPage() {
  const { active } = await fetchRafflesFromContract(undefined, undefined, {
    includeCompleted: false,
  })

  return (
    <div className="px-6 py-10">
      <h1 className="font-display text-[28px] font-semibold tracking-tight mb-1">Buy Tickets</h1>
      <p className="text-[13px] text-gray-600 mb-2 max-w-[480px]">
        One ticket per verified human. Pick an active raffle below to enter.
      </p>
      <p className="mb-8">
        <ContractAddressLink />
      </p>
      {active.length === 0 ? (
        <div className="rounded-[10px] border border-gray-200 px-5 py-8 text-center">
          <p className="text-[14px] text-gray-600 mb-4">No active raffles on-chain right now.</p>
          <Link
            href="/create"
            className="inline-block text-[13px] font-medium text-black hover:opacity-70 transition-opacity"
          >
            Create the first raffle →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((raffle) => (
            <RaffleCard key={raffle.id} raffle={raffle} />
          ))}
        </div>
      )}
      <Link
        href="/"
        className="inline-block mt-6 text-[12px] text-gray-400 hover:text-black transition-colors"
      >
        ← Back to home
      </Link>
    </div>
  )
}
