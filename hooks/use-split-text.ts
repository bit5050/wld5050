'use client'

import { useEffect, useRef } from 'react'
import SplitType from 'split-type'
import { gsap } from '@/lib/gsap'

type SplitTarget = string | HTMLElement

type SplitMode = 'chars' | 'words' | 'lines'

type Options = {
  types?: SplitMode
  stagger?: number
  y?: number
  duration?: number
  delay?: number
}

/** Split text and animate chars/lines with GSAP. */
export function useSplitTextAnimation(
  target: SplitTarget,
  {
    types = 'chars',
    stagger = 0.02,
    y = 24,
    duration = 0.6,
    delay = 0,
  }: Options = {}
) {
  const splitRef = useRef<SplitType | null>(null)

  useEffect(() => {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    if (!el) return

    splitRef.current?.revert()
    splitRef.current = new SplitType(el, { types })

    const items =
      types === 'chars' ? splitRef.current.chars :
      types === 'words' ? splitRef.current.words :
      splitRef.current.lines

    if (!items?.length) return

    gsap.from(items, {
      y,
      opacity: 0,
      stagger,
      duration,
      delay,
      ease: 'power3.out',
    })

    return () => {
      splitRef.current?.revert()
      splitRef.current = null
    }
  }, [target, types, stagger, y, duration, delay])
}

export { SplitType }
