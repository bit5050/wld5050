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
