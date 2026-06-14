'use client'

import type { PaymentToken } from '@/lib/contracts/wld5050'
import TokenLogo from '@/components/raffle/TokenLogo'
import {
  PLATFORM_FEE_USDC_LABEL,
  PLATFORM_FEE_WLD_LABEL,
  TICKET_PRICE_USDC_LABEL,
  TICKET_PRICE_WLD_LABEL,
} from '@/lib/pricing'

type Props = {
  value: PaymentToken
  onChange: (token: PaymentToken) => void
  disabled?: boolean
}

const OPTIONS: {
  token: PaymentToken
  label: string
  fee: string
  ticket: string
}[] = [
  {
    token: 'USDC',
    label: 'USDC',
    fee: PLATFORM_FEE_USDC_LABEL,
    ticket: TICKET_PRICE_USDC_LABEL,
  },
  {
    token: 'WLD',
    label: 'WLD',
    fee: PLATFORM_FEE_WLD_LABEL,
    ticket: TICKET_PRICE_WLD_LABEL,
  },
]

export default function PaymentTokenSelector({ value, onChange, disabled }: Props) {
  return (
    <div role="radiogroup" aria-label="Payment token" className="grid gap-3 sm:grid-cols-2">
      {OPTIONS.map(({ token, label, fee, ticket }) => {
        const selected = value === token
        return (
          <button
            key={token}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(token)}
            className={[
              'flex items-start gap-3 rounded-[10px] border-[0.5px] p-4 text-left transition-colors',
              selected
                ? 'border-black bg-black text-white'
                : 'border-[#E0E0E0] bg-white text-black hover:border-black',
              disabled ? 'cursor-not-allowed opacity-50' : '',
            ].join(' ')}
          >
            <span
              className={[
                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border',
                selected ? 'border-white bg-white' : 'border-[#BDBDBD] bg-white',
              ].join(' ')}
              aria-hidden
            >
              {selected ? (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </span>
            <span className="flex min-w-0 flex-1 items-start gap-3">
              <TokenLogo token={token} size={32} />
              <span className="min-w-0">
                <span className="block font-display text-[14px] font-semibold">{label}</span>
                <span
                  className={[
                    'mt-1 block font-mono text-[11px]',
                    selected ? 'text-[#BDBDBD]' : 'text-[#616161]',
                  ].join(' ')}
                >
                  Creation fee: {fee}
                </span>
                <span
                  className={[
                    'mt-0.5 block font-mono text-[10px]',
                    selected ? 'text-[#757575]' : 'text-[#9E9E9E]',
                  ].join(' ')}
                >
                  Tickets: {ticket}
                </span>
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
