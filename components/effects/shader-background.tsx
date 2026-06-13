'use client'

import { MeshGradient } from '@paper-design/shaders-react'

type Props = {
  className?: string
  colors?: string[]
  speed?: number
}

/** Masked shader hero background — use behind content with `relative z-10`. */
export function ShaderBackground({
  className = 'absolute inset-0 -z-10 h-full w-full opacity-40',
  colors = ['#000000', '#FFFFFF', '#00C853', '#E0E0E0'],
  speed = 0.25,
}: Props) {
  return (
    <div className={className} aria-hidden>
      <MeshGradient colors={colors} speed={speed} className="h-full w-full" />
    </div>
  )
}
