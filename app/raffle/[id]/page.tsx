'use client'

import { useEffect, useMemo, useState } from 'react'
import type { IDKitResult } from '@worldcoin/idkit'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  buyTicketStepText,
  formatPrizePool,
  formatTokenAmount,
  formatWinnerShare,
  ticketPriceLabel,
  winStepText,
  winnerPayoutMessage,
} from '@/lib/pricing'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import WorldIdVerifyButton from '@/components/worldid/world-id-verify-button'
import ENSName from '@/components/ens/ENSName'
import ShareRaffleButtons from '@/components/raffle/ShareRaffleButtons'
import RaffleCountdown from '@/components/raffle/RaffleCountdown'
import PaymentTokenBadge from '@/components/raffle/PaymentTokenBadge'
import ContractAddressLink from '@/components/raffle/ContractAddressLink'
import RaffleSettlementPanel from '@/components/raffle/RaffleSettlementPanel'
import { useBuyTicketTx } from '@/hooks/use-raffle-transactions'
import { useRaffleCountdown } from '@/hooks/use-raffle-countdown'
import { useRaffle } from '@/hooks/use-raffle-data'
import { worldIdEnterRaffleAction } from '@/lib/worldid/actions'
import {
  getRaffleBadgeLabel,
  isAwaitingCreSettlement,
  isRaffleSettled,
} from '@/lib/raffle-display'

export default function RafflePage() {
  const params = useParams()
  const raffleId = Number(params.id)
  const worldIdAction = useMemo(
    () => (Number.isFinite(raffleId) ? worldIdEnterRaffleAction(raffleId) : 'enter-raffle'),
    [raffleId],
  )

  const { raffle, settlement, isLoading, error, refreshStats } = useRaffle(raffleId)
  const [worldIdResult, setWorldIdResult] = useState<IDKitResult | null>(null)
  const [entered, setEntered] = useState(false)

  const { address, contractAddress, buyTicket, isPending, isSuccess, txHash } =
    useBuyTicketTx(raffleId, raffle?.paymentToken)

  const startTime = raffle?.startTime ?? 0
  const endTime = raffle?.endTime ?? 0
  const paymentToken = raffle?.paymentToken ?? 'USDC'
  const { phase, startsIn, endsIn } = useRaffleCountdown(startTime, endTime)

  const verified = worldIdResult !== null
  const tickets = raffle?.ticketsSold ?? 0
  const prizePool = formatPrizePool(tickets, paymentToken)
  const winnerShare = settlement
    ? formatTokenAmount(settlement.winnerPrize, paymentToken)
    : formatWinnerShare(tickets, paymentToken)
  const isUpcoming = phase === 'upcoming'
  const isLive = raffle?.status === 'ACTIVE' && phase === 'live'
  const isSettled = isRaffleSettled(raffle?.status ?? 'ACTIVE')
  const awaitingCre = isAwaitingCreSettlement(phase, raffle?.status ?? 'ACTIVE')
  const canEnter = isLive && !entered
  const badgeLabel = getRaffleBadgeLabel(phase, raffle?.status ?? 'ACTIVE')

  useEffect(() => {
    if (!isSuccess) return
    setEntered(true)
    void refreshStats()
    toast.success("Ticket confirmed — you're in!")
  }, [isSuccess, refreshStats])

  if (isLoading) {
    return (
      <div className="px-6 py-10">
        <p className="text-[13px] text-gray-500">Loading raffle from contract…</p>
      </div>
    )
  }

  if (!raffle || error) {
    return (
      <div className="px-6 py-10">
        <Link
          href="/buy-tickets"
          className="mb-6 inline-block text-[12px] text-gray-400 transition-colors hover:text-black"
        >
          ← All raffles
        </Link>
        <p className="text-[13px] text-gray-600">{error ?? 'Raffle not found.'}</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-10">
      <Link
        href="/buy-tickets"
        className="mb-6 inline-block text-[12px] text-gray-400 transition-colors hover:text-black"
      >
        ← All raffles
      </Link>

      <div className="mb-2 flex items-start justify-between gap-3">
        <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight">
          {raffle.name}
        </h1>
        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
          <PaymentTokenBadge token={raffle.paymentToken} size="md" />
          <span className="rounded-full border border-black px-2.5 py-1 font-mono text-[10px]">
            ● {badgeLabel}
          </span>
        </div>
      </div>
      <div className="mb-2 flex items-center gap-2 text-[12px] text-gray-600">
        <span
          className={[
            'inline-block h-1.5 w-1.5 rounded-full',
            isLive ? 'bg-green-500' : awaitingCre ? 'bg-amber-500' : isSettled ? 'bg-black' : 'bg-gray-400',
          ].join(' ')}
        />
        <span>
          Created by{' '}
          <span className="font-medium text-black">
            <ENSName address={raffle.creator} fallback={raffle.creatorEns ?? undefined} />
          </span>
        </span>
        <span className="text-gray-300">·</span>
        <span>Tickets sold in {raffle.paymentToken}</span>
        <span className="text-gray-300">·</span>
        <ContractAddressLink />
      </div>

      <RaffleCountdown
        phase={phase}
        startsIn={startsIn}
        endsIn={endsIn}
        settled={isSettled}
        paymentToken={raffle.paymentToken}
      />

      <div className="mb-8 grid grid-cols-3 gap-4 border-b border-gray-100 pb-8">
        {[
          { label: 'Tickets sold', value: String(tickets), green: false },
          { label: 'Prize pool', value: prizePool, green: true },
          {
            label: isSettled ? 'Winner received' : 'Winner gets',
            value: winnerShare,
            green: false,
          },
        ].map(({ label, value, green }) => (
          <div key={label}>
            <p className="mb-1.5 text-[10px] uppercase tracking-widest text-gray-400">{label}</p>
            <p
              className={`font-mono text-[22px] font-bold tracking-tight ${green ? 'text-green-600' : ''}`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {isSettled && settlement ? (
        <RaffleSettlementPanel
          settlement={settlement}
          creator={raffle.creator}
          creatorEns={raffle.creatorEns}
        />
      ) : null}

      <div className="mb-8 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] p-4">
        <ShareRaffleButtons raffleId={raffleId} raffleName={raffle.name} />
      </div>

      <div className="mb-8">
        <p className="mb-4 text-[11px] uppercase tracking-widest text-gray-400">How it works</p>
        <div className="space-y-2">
          {[
            { step: '01', text: 'Connect wallet with Privy' },
            { step: '02', text: 'Verify with World ID — proves you are a unique human' },
            { step: '03', text: buyTicketStepText(raffle.paymentToken) },
            { step: '04', text: winStepText(raffle.paymentToken) },
          ].map(({ step, text }) => (
            <div
              key={step}
              className="flex items-start gap-3 border-b border-gray-100 py-2.5 last:border-0"
            >
              <span className="mt-0.5 flex-none font-mono text-[11px] text-gray-400">{step}</span>
              <span className="text-[13px] text-gray-600">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {!canEnter && !entered ? (
        <div className="rounded-[10px] border border-gray-200 p-5 text-center">
          {isSettled ? (
            settlement ? null : (
              <p className="text-[13px] text-gray-600">Loading settlement details…</p>
            )
          ) : awaitingCre ? (
            <div className="space-y-2">
              <p className="text-[13px] text-gray-600">
                Entries are closed. Chainlink CRE is selecting a random winner and sending{' '}
                {raffle.paymentToken} payouts automatically.
              </p>
              <p className="font-mono text-[11px] text-gray-400">
                This page refreshes every 30 seconds until settlement completes.
              </p>
            </div>
          ) : (
            <p className="text-[13px] text-gray-600">
              {isUpcoming
                ? 'This raffle has not started yet. The countdown above shows when entries open.'
                : 'This raffle is no longer active. '}
              {!isUpcoming ? (
                <Link href="/results" className="text-black underline underline-offset-2">
                  View results
                </Link>
              ) : null}
            </p>
          )}
        </div>
      ) : entered ? (
        <div className="rounded-[10px] border border-gray-200 p-5 text-center">
          <VerifiedBadge
            label={
              awaitingCre
                ? "You're entered — waiting for CRE draw"
                : "You're entered — good luck"
            }
          />
          {txHash ? (
            <p className="mt-3 break-all font-mono text-[11px] text-gray-500">{txHash}</p>
          ) : null}
          <p className="mt-3 text-[12px] text-gray-600">
            {winnerPayoutMessage(raffle.paymentToken)}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {!address ? (
            <div className="rounded-[10px] border border-gray-100 bg-gray-50 px-4 py-4">
              <p className="mb-3 text-[13px] text-gray-600">Connect your wallet to enter this raffle.</p>
              <ConnectWalletButton />
            </div>
          ) : null}

          {!verified ? (
            <WorldIdVerifyButton
              action={worldIdAction}
              signal={address}
              onVerified={(result) => {
                setWorldIdResult(result)
                toast.success('World ID verified')
              }}
              onError={(message) => toast.error(message)}
              disabled={!address}
              label="Verify with World ID to enter"
            />
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-[7px] border border-gray-100 bg-gray-50 px-4 py-3">
                <VerifiedBadge label="World ID verified" />
              </div>
              <button
                type="button"
                disabled={!contractAddress || isPending || !raffle.paymentToken}
                onClick={async () => {
                  if (!worldIdResult) return
                  try {
                    await buyTicket(worldIdResult)
                    toast.success('Ticket purchase submitted')
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : 'Failed to buy ticket')
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-[7px] bg-black py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPending ? (
                  'Confirm in wallet…'
                ) : (
                  <>
                    Buy ticket
                    <span className="inline-flex items-center gap-1.5 font-mono text-[13px] opacity-90">
                      <PaymentTokenBadge
                        token={raffle.paymentToken}
                        showLabel={false}
                        className="border-white/20 bg-white/10"
                      />
                      {ticketPriceLabel(raffle.paymentToken)}
                    </span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}

      <p className="mt-4 text-center text-[11px] leading-relaxed text-gray-400">
        One entry per World ID verified human · Powered by Chainlink CRE · wld5050.eth
      </p>
    </div>
  )
}
