export function formatUSDC(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatCountdown(endTime: number): string {
  return formatCountdownTo(endTime)
}

export type RaffleTimingPhase = 'upcoming' | 'live' | 'ended'

export function getRaffleTimingPhase(
  startTime: number,
  endTime: number,
  nowUnix = Math.floor(Date.now() / 1000),
): RaffleTimingPhase {
  if (nowUnix >= endTime) return 'ended'
  if (nowUnix < startTime) return 'upcoming'
  return 'live'
}

/** Human-readable countdown to a unix timestamp (ticks well with 1s updates). */
export function formatCountdownTo(
  targetUnix: number,
  nowUnix = Math.floor(Date.now() / 1000),
): string {
  const diff = targetUnix - nowUnix
  if (diff <= 0) return 'Ended'

  const d = Math.floor(diff / 86_400)
  const h = Math.floor((diff % 86_400) / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60

  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function prizePool(ticketsSold: number): number {
  return ticketsSold * 2.5
}

export function winnerShare(ticketsSold: number): number {
  return prizePool(ticketsSold) / 2
}
