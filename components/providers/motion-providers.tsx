'use client'

import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

function GsapLenisSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(ticker)
    }
  }, [lenis])

  return null
}

export default function MotionProviders({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <>{children}</>
  }

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, autoRaf: true }}>
      <GsapLenisSync />
      {children}
    </ReactLenis>
  )
}
