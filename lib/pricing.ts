import type { PaymentToken } from '@/lib/contracts/wld5050'

/** On-chain fee amounts (USDC ≈ USD; WLD uses matching nominal amounts). */
export const TICKET_PRICE_USDC = 2.5
export const TICKET_PRICE_WLD = 2.5
export const PLATFORM_FEE_USDC = 10
export const PLATFORM_FEE_WLD = 10

/** @deprecated Use TICKET_PRICE_USDC or token-specific helpers — same numeric value. */
export const TICKET_PRICE = TICKET_PRICE_USDC

/** @deprecated Use PLATFORM_FEE_USDC or token-specific helpers — same numeric value. */
export const PLATFORM_FEE = PLATFORM_FEE_USDC

export const PLATFORM_FEE_USDC_LABEL = '$10.00 USDC'
export const PLATFORM_FEE_WLD_LABEL = '10.00 WLD'
export const TICKET_PRICE_USDC_LABEL = '$2.50 USDC'
export const TICKET_PRICE_WLD_LABEL = '2.50 WLD'

/** Compact dual-currency display for stats and cards. */
export const PLATFORM_FEE_DUAL_LABEL = '$10.00 USDC · 10.00 WLD'
export const TICKET_PRICE_DUAL_LABEL = '$2.50 USDC · 2.50 WLD'

/** Prose-friendly dual-currency phrasing. */
export const PLATFORM_FEE_DUAL_LONG = '$10.00 USDC or 10.00 WLD'
export const TICKET_PRICE_DUAL_LONG = '$2.50 USDC or 2.50 WLD per ticket'

export const PLATFORM_FEE_TO_WALLET = `${PLATFORM_FEE_DUAL_LABEL} → wld5050.eth`

export function platformFeeLabel(token: PaymentToken): string {
  return token === 'USDC' ? PLATFORM_FEE_USDC_LABEL : PLATFORM_FEE_WLD_LABEL
}

export function ticketPriceLabel(token: PaymentToken): string {
  return token === 'USDC' ? TICKET_PRICE_USDC_LABEL : TICKET_PRICE_WLD_LABEL
}

export function ticketUnitPrice(token: PaymentToken): number {
  return token === 'USDC' ? TICKET_PRICE_USDC : TICKET_PRICE_WLD
}

export function formatTokenAmount(amount: number, token: PaymentToken): string {
  if (token === 'USDC') return `$${amount.toFixed(2)}`
  return `${amount.toFixed(2)} WLD`
}

export function formatPrizePool(ticketsSold: number, token: PaymentToken): string {
  const total = ticketsSold * ticketUnitPrice(token)
  if (token === 'USDC') return `$${total.toFixed(2)}`
  return `${total.toFixed(2)} WLD`
}

export function formatWinnerShare(ticketsSold: number, token: PaymentToken): string {
  const share = (ticketsSold * ticketUnitPrice(token)) / 2
  if (token === 'USDC') return `$${share.toFixed(2)}`
  return `${share.toFixed(2)} WLD`
}

export function winnerPayoutMessage(token: PaymentToken): string {
  return token === 'USDC'
    ? 'You will receive USDC automatically if you win. No action needed.'
    : 'You will receive WLD automatically if you win. No action needed.'
}

export function buyTicketStepText(token: PaymentToken): string {
  return `Buy 1 ticket for ${ticketPriceLabel(token)} — one per verified human per raffle`
}

export function winStepText(token: PaymentToken): string {
  return token === 'USDC'
    ? 'If you win, USDC arrives automatically — no claiming needed'
    : 'If you win, WLD arrives automatically — no claiming needed'
}
