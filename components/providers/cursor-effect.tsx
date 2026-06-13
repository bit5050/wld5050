'use client'

import { useEffect } from 'react'
import {
  followingDotCursor,
  fairyDustCursor,
  snowflakeCursor,
  trailingCursor,
  type CursorEffectResult,
} from 'cursor-effects'

type CursorVariant = 'dot' | 'fairy' | 'snow' | 'trail'

type Props = {
  variant?: CursorVariant
  /** Disable on touch devices */
  disabledOnTouch?: boolean
}

const effects: Record<
  CursorVariant,
  () => CursorEffectResult
> = {
  dot: () => followingDotCursor({ color: '#00C853' }),
  fairy: () => fairyDustCursor({ colors: ['#000000', '#00C853', '#E0E0E0'] }),
  snow: () => snowflakeCursor(),
  trail: () => trailingCursor({ particles: 8, rate: 0.4 }),
}

/** Opt-in cursor polish — mount once near root (not enabled by default in layout). */
export default function CursorEffect({ variant = 'dot', disabledOnTouch = true }: Props) {
  useEffect(() => {
    if (disabledOnTouch && window.matchMedia('(pointer: coarse)').matches) return

    const effect = effects[variant]()
    return () => effect.destroy()
  }, [variant, disabledOnTouch])

  return null
}

export { followingDotCursor, fairyDustCursor, snowflakeCursor, trailingCursor }
