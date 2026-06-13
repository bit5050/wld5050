'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Attach GSAP ScrollTrigger animations to a ref. Reverts on unmount.
 */
export function useGsapScrollTrigger(
  setup: (el: HTMLElement) => void,
  deps: React.DependencyList = []
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      setup(ref.current!)
    }, ref)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

export { gsap, ScrollTrigger }
