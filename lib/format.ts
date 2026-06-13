export function formatUSDC(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatCountdown(endTime: number): string {
  const diff = endTime - Math.floor(Date.now() / 1000)
  if (diff <= 0) return 'Ended'
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`
  return `${h}h ${m}m`
}

export function prizePool(ticketsSold: number): number {
  return ticketsSold * 2.5
}

export function winnerShare(ticketsSold: number): number {
  return prizePool(ticketsSold) / 2
}
