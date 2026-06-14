import type { Metadata } from 'next'
import Link from 'next/link'
import RaffleCard from '@/components/raffle/RaffleCard'
import ContractAddressLink from '@/components/raffle/ContractAddressLink'
import { fetchRafflesFromContract } from '@/lib/contracts/fetch-raffles'
import { siteShareImage, SITE_SHARE_IMAGE_PATH } from '@/lib/seo/share-image'

export const metadata: Metadata = {
  title: 'Buy Tickets World Chain WLD Raffle',
  description: 'Buy Tickets World Chain WLD Raffle , Create World ID 50/50 Raffle',
  openGraph: {
    title: 'Buy Tickets World Chain WLD Raffle',
    description: 'Buy Tickets World Chain WLD Raffle , Create World ID 50/50 Raffle',
    images: siteShareImage,
  },
  twitter: {
    title: 'Buy Tickets World Chain WLD Raffle',
    description: 'Buy Tickets World Chain WLD Raffle , Create World ID 50/50 Raffle',
    images: [SITE_SHARE_IMAGE_PATH],
  },
}

export const revalidate = 30

export default async function BuyTicketsPage() {
  const { active } = await fetchRafflesFromContract(undefined, undefined, {
    includeCompleted: false,
  })

  return (
    <section className="relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px] border-[#E0E0E0] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
        <div className="mb-8">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#9E9E9E]">
            Live now
          </p>
          <h1 className="font-display text-[28px] font-semibold tracking-tight sm:text-[32px]">
            Buy Tickets
          </h1>
          <p className="mt-2 max-w-[560px] text-[13px] text-[#616161]">
            One human, one ticket, every time. World ID verification. Chainlink-powered winners. ENS identities and winner badges.
          </p>
          <p className="mt-2">
            <ContractAddressLink />
          </p>
        </div>

        {active.length === 0 ? (
          <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] px-5 py-10 text-center">
            <p className="mb-4 font-body text-[14px] text-[#616161]">
              No active raffles on-chain right now.
            </p>
            <Link
              href="/create"
              className="inline-block text-[13px] font-medium text-black transition-opacity hover:opacity-70"
            >
              Create the first raffle →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {active.map((raffle) => (
              <RaffleCard key={raffle.id} raffle={raffle} compact />
            ))}
          </div>
        )}

        <Link
          href="/"
          className="mt-8 inline-block text-[12px] text-[#9E9E9E] transition-colors hover:text-black"
        >
          ← Back to home
        </Link>
      </div>
    </section>
  )
}
