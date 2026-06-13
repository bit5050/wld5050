export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function displayAddress(address: string, ens: string | null): string {
  return ens ?? truncateAddress(address)
}

export function winnerSubname(raffleId: number): string {
  return `winner-round${raffleId}.wld5050.eth`
}
