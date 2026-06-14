import Link from 'next/link'
import ENSName from '@/components/ens/ENSName'
import PaymentTokenBadge from '@/components/raffle/PaymentTokenBadge'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import { formatTokenAmount } from '@/lib/pricing'
import { getAddressExplorerUrl, getTxExplorerUrl } from '@/lib/share/raffle-share'
import type { Settlement } from '@/types'

type Props = {
  settlement: Settlement
  creator: string
  creatorEns?: string | null
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function WorldscanLink({
  href,
  label,
  mono = false,
}: {
  href: string
  label: string
  mono?: boolean
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'inline-flex items-center gap-1 text-[11px] text-[#616161] transition-colors hover:text-black',
        mono ? 'font-mono' : '',
      ].join(' ')}
    >
      {label}
      <span aria-hidden>↗</span>
    </Link>
  )
}

export default function RaffleSettlementPanel({ settlement, creator, creatorEns }: Props) {
  const { paymentToken, winnerPrize, creatorPayout, winner, winnerEns, txHash } = settlement

  return (
    <div className="mb-8 overflow-hidden rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#E0E0E0] bg-black px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">
          50/50 settlement
        </p>
        <PaymentTokenBadge
          token={paymentToken}
          className="border-white/20 bg-white/10 text-white"
        />
      </div>

      <div className="space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[8px] border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-400">Winner</p>
            <p className="mb-1 font-display text-[15px] font-semibold tracking-tight text-black">
              <ENSName address={winner} fallback={winnerEns ?? undefined} />
            </p>
            <VerifiedBadge label="World ID verified winner" />
            <p className="mt-2">
              <WorldscanLink
                href={getAddressExplorerUrl(winner)}
                label={`${truncateAddress(winner)} on Worldscan`}
                mono
              />
            </p>
          </div>

          <div className="rounded-[8px] border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-400">Creator</p>
            <p className="mb-1 font-display text-[15px] font-semibold tracking-tight text-black">
              <ENSName address={creator} fallback={creatorEns ?? undefined} />
            </p>
            <p className="text-[12px] text-gray-500">Hosted this raffle</p>
            <p className="mt-2">
              <WorldscanLink
                href={getAddressExplorerUrl(creator)}
                label={`${truncateAddress(creator)} on Worldscan`}
                mono
              />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Winner received (50%)', value: formatTokenAmount(winnerPrize, paymentToken) },
            { label: 'Creator received (50%)', value: formatTokenAmount(creatorPayout, paymentToken) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-[8px] border border-gray-100 px-4 py-3"
            >
              <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">{label}</p>
              <p className="font-mono text-[18px] font-bold tracking-tight text-black">{value}</p>
            </div>
          ))}
        </div>

        {settlement.winnerSubname ? (
          <div className="rounded-[8px] border border-gray-100 px-4 py-3">
            <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">Winner ENS</p>
            <p className="font-mono text-[12px] font-bold text-black">{settlement.winnerSubname}</p>
          </div>
        ) : null}

        {txHash ? (
          <div className="rounded-[8px] border border-black/10 bg-[#FAFAFA] px-4 py-3">
            <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">
              Proof of payment
            </p>
            <p className="mb-2 text-[12px] text-gray-600">
              Both payouts were pushed in one Chainlink CRE settlement transaction on World Chain.
            </p>
            <WorldscanLink
              href={getTxExplorerUrl(txHash)}
              label={`Settlement tx ${truncateAddress(txHash)}`}
              mono
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
