const MIN_DURATION_SECONDS = 1

function parseDateTime(date: string, time: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

/** Contract sets endTime = block.timestamp + duration. */
export function computeRaffleDurationSeconds(endDate: string, endTime: string): bigint {
  const end = parseDateTime(endDate, endTime)
  const seconds = Math.floor((end.getTime() - Date.now()) / 1000)

  if (seconds < MIN_DURATION_SECONDS) {
    throw new Error('Raffle end time must be in the future.')
  }

  return BigInt(seconds)
}

export function getContractAddress(): `0x${string}` | null {
  const address = process.env.NEXT_PUBLIC_WLD5050_CONTRACT ?? ''
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return null
  if (address === '0x0000000000000000000000000000000000000000') return null
  return address as `0x${string}`
}
