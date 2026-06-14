import type { Metadata } from 'next'
import Link from 'next/link'
import CompletedRaffleCard from '@/components/raffle/CompletedRaffleCard'
import ContractAddressLink from '@/components/raffle/ContractAddressLink'
import { fetchRafflesFromContract } from '@/lib/contracts/fetch-raffles'
import { siteShareImage, SITE_SHARE_IMAGE_PATH } from '@/lib/seo/share-image'

export const metadata: Metadata = {
  title: 'Results | WLD5050 | World Chain WLD Raffle',
  description: 'Results | WLD5050 | World Chain WLD Raffle',
  openGraph: {
    title: 'Results | WLD5050 | World Chain WLD Raffle',
    description: 'Results | WLD5050 | World Chain WLD Raffle',
    images: siteShareImage,
  },
  twitter: {
    title: 'Results | WLD5050 | World Chain WLD Raffle',
    description: 'Results | WLD5050 | World Chain WLD Raffle',
    images: [SITE_SHARE_IMAGE_PATH],
  },
}

export const revalidate = 30

export default async function ResultsPage() {
  const { completed } = await fetchRafflesFromContract()

  return (
    <section className="relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px] border-[#E0E0E0] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
        <div className="mb-8">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#9E9E9E]">
            Settled onchain
          </p>
          <h1 className="font-display text-[28px] font-semibold tracking-tight sm:text-[32px]">
            Completed Raffle Results
          </h1>
          <p className="mt-2 max-w-[560px] text-[13px] text-[#616161]">
            WLD5050 verified settlements.
          </p>
          <p className="mt-2">
            <ContractAddressLink />
          </p>
        </div>

        {completed.length === 0 ? (
          <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] px-5 py-10 text-center">
            <p className="font-body text-[14px] text-[#616161]">
              No settled raffles yet. Results appear here after Chainlink CRE completes a draw.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {completed.map((raffle) => (
              <div key={raffle.raffleId} id={`round-${raffle.raffleId}`}>
                <CompletedRaffleCard raffle={raffle} compact />
              </div>
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
