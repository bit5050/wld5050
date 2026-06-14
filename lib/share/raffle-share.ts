const DEFAULT_ORIGIN = 'https://wld5050.vercel.app'

export function getRaffleUrl(raffleId: number, origin?: string): string {
  const base =
    origin ?? (typeof window !== 'undefined' ? window.location.origin : DEFAULT_ORIGIN)
  return `${base.replace(/\/$/, '')}/raffle/${raffleId}`
}

export function getTxExplorerUrl(txHash: string): string {
  return `https://worldscan.org/tx/${txHash}`
}

export function getAddressExplorerUrl(address: string): string {
  return `https://worldscan.org/address/${address}`
}

export function buildShareMessage(raffleName: string, raffleUrl: string): string {
  return `Join my WLD5050 raffle "${raffleName}" — human-verified 50/50 on World Chain. ${raffleUrl}`
}

export function shareToX(message: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
}

export function shareToFacebook(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

export function shareToWhatsApp(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export function shareToTelegram(url: string, message: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`
}
