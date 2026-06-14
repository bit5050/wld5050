import Link from 'next/link'
import ENSName from '@/components/ens/ENSName'
import WinnerEnsLink from '@/components/ens/WinnerEnsLink'
import PaymentTokenBadge from '@/components/raffle/PaymentTokenBadge'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import { formatTokenAmount } from '@/lib/pricing'
import {
  getAddressTokenTransfersUrl,
  getTxTokenTransfersUrl,
} from '@/lib/share/raffle-share'
import type { Settlement } from '@/types'

type Props = {
  settlement: Settlement
  creator?: string
  creatorEns?: string | null
  onEnsClaimed?: () => void
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

export default function RaffleSettlementPanel({
  settlement,
  creator: creatorProp,
  creatorEns,
  onEnsClaimed,
}: Props) {
  const {
    paymentToken,
    winnerPrize,
    creatorPayout,
    winner,
    winnerEns,
    creator: settlementCreator,
    txHash,
  } = settlement
  const creator = creatorProp ?? settlementCreator

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
                href={getAddressTokenTransfersUrl(winner)}
                label={`${paymentToken} payment · ${truncateAddress(winner)}`}
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
                href={getAddressTokenTransfersUrl(creator)}
                label={`${paymentToken} payment · ${truncateAddress(creator)}`}
                mono
              />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: 'Winner received (50%)',
              value: formatTokenAmount(winnerPrize, paymentToken),
              href: getAddressTokenTransfersUrl(winner),
            },
            {
              label: 'Creator received (50%)',
              value: formatTokenAmount(creatorPayout, paymentToken),
              href: getAddressTokenTransfersUrl(creator),
            },
          ].map(({ label, value, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[8px] border border-gray-100 px-4 py-3 transition-colors hover:border-black"
            >
              <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">{label}</p>
              <p className="font-mono text-[18px] font-bold tracking-tight text-black">{value}</p>
              <p className="mt-1 font-mono text-[10px] text-gray-400">View on Worldscan ↗</p>
            </Link>
          ))}
        </div>

        {settlement.winnerSubname ? (
          <WinnerEnsLink
            raffleId={settlement.raffleId}
            winner={settlement.winner as `0x${string}`}
            winnerSubname={settlement.winnerSubname}
            ensMinted={settlement.ensMinted}
            onEnsClaimed={onEnsClaimed}
          />
        ) : null}

        {txHash ? (
          <div className="rounded-[8px] border border-black/10 bg-[#FAFAFA] px-4 py-3">
            <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">
              Proof of payment
            </p>
            <p className="mb-2 text-[12px] text-gray-600">
              Both {paymentToken} payouts in one Chainlink CRE settlement — view token transfers
              below.
            </p>
            <WorldscanLink
              href={getTxTokenTransfersUrl(txHash)}
              label={`50/50 token transfers · tx ${truncateAddress(txHash)}`}
              mono
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
