import Link from 'next/link'
import WinnerCard from '@/components/raffle/WinnerCard'
import ContractAddressLink from '@/components/raffle/ContractAddressLink'
import { fetchRafflesFromContract, toSettlement } from '@/lib/contracts/fetch-raffles'

export const revalidate = 30

export default async function ResultsPage() {
  const { completed } = await fetchRafflesFromContract()

  return (
    <div className="px-6 py-10">
      <h1 className="font-display text-[28px] font-semibold tracking-tight mb-1">Results</h1>
      <p className="text-[13px] text-gray-600 mb-2 max-w-[480px]">
        Past raffle settlements verified and paid automatically by Chainlink CRE.
      </p>
      <p className="mb-8">
        <ContractAddressLink />
      </p>
      {completed.length === 0 ? (
        <div className="rounded-[10px] border border-gray-200 px-5 py-8 text-center">
          <p className="text-[14px] text-gray-600">No settled raffles yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {completed.map((raffle) => (
            <div key={raffle.raffleId} id={`round-${raffle.raffleId}`}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-gray-400">
                {raffle.raffleName}
              </p>
              <WinnerCard settlement={toSettlement(raffle)} />
            </div>
          ))}
        </div>
      )}
      <Link
        href="/"
        className="inline-block mt-8 text-[12px] text-gray-400 hover:text-black transition-colors"
      >
        ← Back to home
      </Link>
    </div>
  )
}
