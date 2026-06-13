'use client'

import { useMemo } from 'react'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { ISourceOptions } from '@tsparticles/engine'

type Props = {
  className?: string
  variant?: 'snow' | 'dots'
}

function ParticlesLayer({ variant }: { variant: 'snow' | 'dots' }) {
  const options: ISourceOptions = useMemo(
    () =>
      variant === 'snow'
        ? {
            fullScreen: { enable: false },
            background: { color: { value: 'transparent' } },
            particles: {
              number: { value: 80 },
              color: { value: '#FFFFFF' },
              opacity: { value: 0.6 },
              size: { value: { min: 1, max: 3 } },
              move: { enable: true, speed: 1.2, direction: 'bottom' },
            },
          }
        : {
            fullScreen: { enable: false },
            background: { color: { value: 'transparent' } },
            particles: {
              number: { value: 40 },
              color: { value: '#E0E0E0' },
              opacity: { value: 0.35 },
              size: { value: 1 },
              move: { enable: true, speed: 0.4 },
            },
          },
    [variant]
  )

  return <Particles id={`wld5050-particles-${variant}`} options={options} className="h-full w-full" />
}

export function ParticlesBackground({ className = 'absolute inset-0 -z-10', variant = 'dots' }: Props) {
  return (
    <div className={className} aria-hidden>
      <ParticlesProvider init={loadSlim}>
        <ParticlesLayer variant={variant} />
      </ParticlesProvider>
    </div>
  )
}
