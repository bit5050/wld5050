'use client'

import { useEffect, useMemo, useState } from 'react'
import type { IDKitResult } from '@worldcoin/idkit'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import WorldIdVerifyButton from '@/components/worldid/world-id-verify-button'
import RaffleCreatedSuccessDialog from '@/components/raffle/RaffleCreatedSuccessDialog'
import PaymentTokenSelector from '@/components/raffle/PaymentTokenSelector'
import ContractAddressLink from '@/components/raffle/ContractAddressLink'
import { useCreateRaffleTx, type CreateRaffleResult } from '@/hooks/use-raffle-transactions'
import type { PaymentToken } from '@/lib/contracts/wld5050'
import { getWld5050WorldscanUrl } from '@/lib/contracts/contract-address'
import { platformFeeLabel, ticketPriceLabel } from '@/lib/pricing'
import { AGENT_ENS, PLATFORM_WALLET } from '@/types'

type Props = {
  variant?: 'section' | 'page'
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toDateValue(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function toTimeValue(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatDateTime(date: string, time: string) {
  if (!date || !time) return 'Not set'
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const dt = new Date(y, m - 1, d, hh, mm)
  return dt.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function applyDurationFromNow(minutes: number) {
  const start = new Date()
  const end = new Date(start.getTime() + minutes * 60_000)
  return {
    startDate: toDateValue(start),
    startTime: toTimeValue(start),
    endDate: toDateValue(end),
    endTime: toTimeValue(end),
  }
}

const DURATION_PRESETS = [
  { label: '1 min', minutes: 1 },
  { label: '5 min', minutes: 5 },
  { label: '1 hour', minutes: 60 },
  { label: '1 day', minutes: 24 * 60 },
] as const

export default function CreateRaffleForm({ variant = 'section' }: Props) {
  const router = useRouter()
  const defaultSchedule = useMemo(() => applyDurationFromNow(5), [])

  const [name, setName] = useState('')
  const [paymentToken, setPaymentToken] = useState<PaymentToken>('USDC')
  const [startDate, setStartDate] = useState(defaultSchedule.startDate)
  const [startTime, setStartTime] = useState(defaultSchedule.startTime)
  const [endDate, setEndDate] = useState(defaultSchedule.endDate)
  const [endTime, setEndTime] = useState(defaultSchedule.endTime)
  const [durationPreset, setDurationPreset] = useState<number | null>(5)
  const [worldIdResult, setWorldIdResult] = useState<IDKitResult | null>(null)
  const [verifiedAt, setVerifiedAt] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [createdRaffle, setCreatedRaffle] = useState<CreateRaffleResult | null>(null)
  const [successOpen, setSuccessOpen] = useState(false)

  const {
    address,
    contractAddress,
    createRaffle,
    isPending,
    worldIdAction,
  } = useCreateRaffleTx()

  const created = createdRaffle !== null

  const verified = worldIdResult !== null
  const proofStale =
    verifiedAt !== null && Date.now() - verifiedAt > 2 * 60 * 1000
  const formReady = name.trim().length > 0 && Boolean(address) && Boolean(contractAddress)
  const canSubmit = formReady && verified && !proofStale

  useEffect(() => {
    if (created) router.refresh()
  }, [created, router])

  function applyPreset(minutes: number) {
    const schedule = applyDurationFromNow(minutes)
    setStartDate(schedule.startDate)
    setStartTime(schedule.startTime)
    setEndDate(schedule.endDate)
    setEndTime(schedule.endTime)
    setDurationPreset(minutes)
  }

  function clearPreset() {
    setDurationPreset(null)
  }

  return (
    <div
      className={
        variant === 'section'
          ? 'rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 sm:p-8'
          : 'max-w-[720px]'
      }
    >
      <div className="mb-6">
        <h3 className="font-display text-[22px] font-semibold tracking-tight text-black sm:text-[24px]">
          Create Your 50/50 Raffle
        </h3>
        <p className="mt-2 font-mono text-[13px] text-[#616161]">
          Choose USDC or WLD for the creation fee and ticket payouts. Fee goes to{' '}
          <span className="text-black">{PLATFORM_WALLET}</span>.
        </p>
        <p className="mt-2">
          <ContractAddressLink />
        </p>
      </div>

      {/* Payment token */}
      <div className="mb-6">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]">
          Payment token
        </p>
        <PaymentTokenSelector
          value={paymentToken}
          onChange={setPaymentToken}
          disabled={submitting || isPending || created}
        />
      </div>

      {/* Fee breakdown */}
      <div className="mb-6 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] p-4">
        <p className="font-mono text-[10px] text-[#9E9E9E] uppercase tracking-[0.2em] mb-3">
          Fee breakdown
        </p>
        <p className="font-body text-[13px] text-black mb-2">
          Creator pays:{' '}
          <span className="font-mono font-bold">{platformFeeLabel(paymentToken)}</span>
        </p>
        <ul className="space-y-1.5 font-mono text-[12px] text-[#616161]">
          <li>
            {platformFeeLabel(paymentToken)} → {PLATFORM_WALLET}
          </li>
          <li>Ticket price: {ticketPriceLabel(paymentToken)}</li>
        </ul>
      </div>

      <p className="mb-4 font-body text-[12px] leading-relaxed text-[#616161]">
        Raffles can run for any length. 1 minute for a quick demo, or months for a long campaign.
        End time is measured from when the transaction confirms on World Chain.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {DURATION_PRESETS.map(({ label, minutes }) => {
          const selected = durationPreset === minutes
          return (
            <button
              key={label}
              type="button"
              onClick={() => applyPreset(minutes)}
              className={[
                'rounded-[10px] border-[0.5px] px-3 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors',
                selected
                  ? 'border-black bg-black text-white'
                  : 'border-[#E0E0E0] bg-white text-[#616161] hover:border-black hover:text-black',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Wallet */}
      <div className="mb-6 space-y-3">
        {!address ? (
          <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] px-4 py-4">
            <p className="font-body text-[13px] text-[#616161] mb-3">
              Connect your wallet with Privy before creating a raffle.
            </p>
            <ConnectWalletButton />
          </div>
        ) : null}
      </div>

      {/* Form fields */}
      <div className="space-y-5 mb-6">
        <div>
          <label
            htmlFor="raffle-name"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]"
          >
            Raffle name
          </label>
          <input
            id="raffle-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter raffle name"
            className="w-full rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-3 font-body text-[14px] text-black outline-none transition-colors placeholder:text-[#BDBDBD] focus:border-black"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="start-date"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]"
            >
              Start date
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                clearPreset()
              }}
              className="w-full rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-3 font-mono text-[13px] text-black outline-none focus:border-black"
            />
          </div>
          <div>
            <label
              htmlFor="start-time"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]"
            >
              Start time
            </label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value)
                clearPreset()
              }}
              className="w-full rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-3 font-mono text-[13px] text-black outline-none focus:border-black"
            />
          </div>
          <div>
            <label
              htmlFor="end-date"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]"
            >
              End date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                clearPreset()
              }}
              className="w-full rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-3 font-mono text-[13px] text-black outline-none focus:border-black"
            />
          </div>
          <div>
            <label
              htmlFor="end-time"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]"
            >
              End time
            </label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value)
                clearPreset()
              }}
              className="w-full rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-3 font-mono text-[13px] text-black outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Live summary */}
      <div className="mb-6 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-4">
        <p className="font-display text-[14px] font-semibold text-black mb-3">Your Raffle Details:</p>
        <ul className="space-y-1.5 font-body text-[13px] text-[#616161]">
          <li>• Raffle Name: {name.trim() || 'Not set'}</li>
          <li>• Payment token: {paymentToken}</li>
          <li>• Start: {formatDateTime(startDate, startTime)}</li>
          <li>• End: {formatDateTime(endDate, endTime)}</li>
        </ul>
      </div>

      {/* Important information */}
      <div className="mb-6 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] p-4">
        <p className="font-display text-[14px] font-semibold text-black mb-1">
          WLD5050 Important Information:
        </p>
        <a
          href={getWld5050WorldscanUrl('#code')}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 inline-flex items-center gap-1 font-mono text-[11px] text-[#616161] transition-colors hover:text-black"
        >
          WLD5050 Verified Contract
          <span aria-hidden>↗</span>
        </a>
        <ul className="space-y-2 font-body text-[12px] leading-relaxed text-[#616161]">
          <li>
            <strong className="text-black">Platform Creation Fee:</strong>{' '}
            <span className="font-mono">{platformFeeLabel(paymentToken)}</span> → {PLATFORM_WALLET}
          </li>
          <li>
            <strong className="text-black">Ticket Cost:</strong>{' '}
            <span className="font-mono">{ticketPriceLabel(paymentToken)}</span>
          </li>
          <li>
            <strong className="text-black">Prize Distribution:</strong> 50% to winner, 50% to
            creator. Both paid automatically in the same transaction.
          </li>
          <li>
            <strong className="text-black">Winner Selection:</strong> Chainlink CRE DON consensus
            ({AGENT_ENS}) with AI fairness attestation before every draw.
          </li>
          <li>
            <strong className="text-black">Entry Rule:</strong> One ticket per World ID verified
            human. Enforced onchain via ZK proof.
          </li>
          <li>
            <strong className="text-black">Operational Notes:</strong> No claiming step. No admin
            keeper. Settlement is fully automated on World Chain.
          </li>
        </ul>
      </div>

      {/* World ID — verify immediately before submit */}
      {!created ? (
        <div className="mb-6 space-y-3">
          {!verified || proofStale ? (
            <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-black px-4 py-4">
              <p className="font-display text-[14px] font-semibold text-white mb-1">
                {proofStale ? 'World ID proof expired' : 'Verify with World ID'}
              </p>
              <p className="font-body text-[12px] text-[#9E9E9E] mb-4">
                {proofStale
                  ? 'Your proof root is no longer valid on-chain. Verify again, then submit right away.'
                  : 'Fill in raffle details first, then verify immediately before paying. Proofs expire quickly.'}
              </p>
              <WorldIdVerifyButton
                action={worldIdAction}
                signal={address}
                onVerified={(result) => {
                  setWorldIdResult(result)
                  setVerifiedAt(Date.now())
                  toast.success('World ID verified — submit now')
                }}
                onError={(message) => toast.error(message)}
                disabled={!formReady}
                label={proofStale ? 'Re-verify with World ID' : 'Verify with World ID'}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <VerifiedBadge label="World ID verified — submit now" />
              <button
                type="button"
                onClick={() => {
                  setWorldIdResult(null)
                  setVerifiedAt(null)
                }}
                className="font-body text-[12px] text-[#616161] underline underline-offset-2 hover:text-black"
              >
                Re-verify
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Actions */}
      {created && createdRaffle ? (
        <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] px-4 py-4 text-center">
          <VerifiedBadge label="Raffle created on World Chain" />
          <p className="mt-3 font-display text-[16px] font-semibold text-black">
            {name.trim() || 'Your raffle'} is live
          </p>
          <p className="mt-1 font-mono text-[12px] text-[#616161]">
            Raffle #{createdRaffle.raffleId}
          </p>
          <button
            type="button"
            onClick={() => setSuccessOpen(true)}
            className="mt-4 inline-block rounded-[10px] bg-black px-4 py-2.5 font-body text-[13px] font-medium text-white transition-opacity hover:opacity-80"
          >
            Share raffle
          </button>
        </div>
      ) : verified && !proofStale ? (
        <button
          type="button"
          disabled={!canSubmit || isPending || submitting}
          onClick={async () => {
            if (!worldIdResult) return
            setSubmitting(true)
            try {
              const result = await createRaffle({
                name,
                endDate,
                endTime,
                paymentToken,
                worldIdResult,
              })
              setCreatedRaffle(result)
              setSuccessOpen(true)
              toast.success('Raffle created successfully!')
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'Failed to create raffle')
            } finally {
              setSubmitting(false)
            }
          }}
          className="w-full rounded-[10px] bg-black py-3.5 font-body text-[14px] font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isPending || submitting
            ? 'Confirm in wallet…'
            : `Pay ${platformFeeLabel(paymentToken)} & create raffle`}
        </button>
      ) : null}

      <p className="mt-4 text-center font-body text-[11px] leading-relaxed text-[#9E9E9E]">
        Creation fee is non-refundable. Ticket revenue held in escrow on World Chain. Chainlink CRE
        settles automatically when the raffle ends.
      </p>

      {createdRaffle ? (
        <RaffleCreatedSuccessDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          raffleId={createdRaffle.raffleId}
          raffleName={name.trim() || 'Your raffle'}
          txHash={createdRaffle.txHash}
        />
      ) : null}
    </div>
  )
}
