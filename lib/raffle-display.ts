import type { RaffleTimingPhase } from '@/lib/format'
import type { RaffleStatus } from '@/types'

export function getRaffleBadgeLabel(
  phase: RaffleTimingPhase,
  status: RaffleStatus,
): string {
  if (status === 'SETTLED') return 'Settled'
  if (phase === 'upcoming') return 'Starting soon'
  if (phase === 'live' && status === 'ACTIVE') return 'Live'
  if (phase === 'ended') return 'Awaiting CRE'
  if (status === 'EXPIRED') return 'Expired'
  if (status === 'REFUNDED') return 'Refunded'
  return status
}

export function isAwaitingCreSettlement(
  phase: RaffleTimingPhase,
  status: RaffleStatus,
): boolean {
  return phase === 'ended' && status !== 'SETTLED'
}

export function isRaffleSettled(status: RaffleStatus): boolean {
  return status === 'SETTLED'
}
