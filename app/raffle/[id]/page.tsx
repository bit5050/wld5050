'use client'

import { useEffect, useMemo, useState } from 'react'
import type { IDKitResult } from '@worldcoin/idkit'
import Link from 'next/link'
import { toast } from 'sonner'
import { TICKET_PRICE } from '@/types'
import { formatCountdown } from '@/lib/format'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import WorldIdVerifyButton from '@/components/worldid/world-id-verify-button'
import { useBuyTicketTx } from '@/hooks/use-raffle-transactions'
import { worldIdEnterRaffleAction } from '@/lib/worldid/actions'

export default function RafflePage({ params }: { params: { id: string } }) {
  const raffleId = Number(params.id)
  const worldIdAction = useMemo(
    () => (Number.isFinite(raffleId) ? worldIdEnterRaffleAction(raffleId) : 'enter-raffle'),
    [raffleId],
  )

  const [tickets, setTickets] = useState(247)
  const [worldIdResult, setWorldIdResult] = useState<IDKitResult | null>(null)
  const [entered, setEntered] = useState(false)
  const endTime = Math.floor(Date.now() / 1000) + 42120

  const { address, contractAddress, buyTicket, isPending, isSuccess, txHash } =
    useBuyTicketTx(raffleId)

  const verified = worldIdResult !== null
  const prizePool = (tickets * TICKET_PRICE).toFixed(2)
  const yourShare = ((tickets * TICKET_PRICE) / 2).toFixed(2)
  const [countdown, setCountdown] = useState<string | null>(null)

  useEffect(() => {
    if (isSuccess) setEntered(true)
  }, [isSuccess])

  useEffect(() => {
    const update = () => setCountdown(formatCountdown(endTime))
    update()
    const t = setInterval(() => {
      update()
      if (Math.random() > 0.5) setTickets((n) => n + 1)
    }, 3000)
    return () => clearInterval(t)
  }, [endTime])

  return (
    <div className="px-6 py-10">
      <Link
        href="/"
        className="mb-6 inline-block text-[12px] text-gray-400 transition-colors hover:text-black"
      >
        ← All raffles
      </Link>

      <div className="mb-2 flex items-start justify-between">
        <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight">
          ETHGlobal NYC Community Pot
        </h1>
        <span className="ml-4 mt-1 flex-none rounded-full border border-black px-2.5 py-1 font-mono text-[10px]">
          ● Live
        </span>
      </div>
      <div className="mb-8 flex items-center gap-2 text-[12px] text-gray-600">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
        <span>
          Created by <span className="font-mono font-medium text-black">bit5050.eth</span>
        </span>
        <span className="text-gray-300">·</span>
        <span>
          Ends in <strong className="text-black">{countdown ?? '…'}</strong>
        </span>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4 border-b border-gray-100 pb-8">
        {[
          { label: 'Tickets sold', value: String(tickets), green: false },
          { label: 'Prize pool', value: `$${prizePool}`, green: true },
          { label: 'Winner gets', value: `$${yourShare}`, green: false },
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

      <div className="mb-8">
        <p className="mb-4 text-[11px] uppercase tracking-widest text-gray-400">How it works</p>
        <div className="space-y-2">
          {[
            { step: '01', text: 'Connect wallet with Privy' },
            { step: '02', text: 'Verify with World ID — proves you are a unique human' },
            { step: '03', text: 'Buy 1 ticket for $2.50 USDC — one per verified human per raffle' },
            { step: '04', text: 'If you win, USDC arrives automatically — no claiming needed' },
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

      {entered ? (
        <div className="rounded-[10px] border border-gray-200 p-5 text-center">
          <VerifiedBadge label="You're entered — good luck" />
          {txHash ? (
            <p className="mt-3 break-all font-mono text-[11px] text-gray-500">{txHash}</p>
          ) : null}
          <p className="mt-3 text-[12px] text-gray-600">
            You will receive USDC automatically if you win. No action needed.
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

          {!contractAddress ? (
            <p className="text-[12px] text-gray-500">
              Set NEXT_PUBLIC_WLD5050_CONTRACT to buy tickets on-chain.
            </p>
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
                disabled={!contractAddress || isPending}
                onClick={async () => {
                  if (!worldIdResult) return
                  try {
                    await buyTicket(worldIdResult)
                    toast.success('Ticket purchase submitted')
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : 'Failed to buy ticket')
                  }
                }}
                className="w-full rounded-[7px] bg-black py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPending ? 'Confirm in wallet…' : 'Buy ticket — '}
                {!isPending ? (
                  <span className="font-mono text-[13px] opacity-70">${TICKET_PRICE.toFixed(2)} USDC</span>
                ) : null}
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
