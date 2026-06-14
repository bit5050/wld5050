'use client'

import { useEffect, useState } from 'react'
import {
  formatCountdownTo,
  getRaffleTimingPhase,
  type RaffleTimingPhase,
} from '@/lib/format'

export function useRaffleCountdown(startTime: number, endTime: number) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))

  useEffect(() => {
    const tick = () => setNow(Math.floor(Date.now() / 1000))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const phase: RaffleTimingPhase = getRaffleTimingPhase(startTime, endTime, now)
  const startsIn = formatCountdownTo(startTime, now)
  const endsIn = formatCountdownTo(endTime, now)

  return { phase, startsIn, endsIn, now }
}
