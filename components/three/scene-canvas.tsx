'use client'

import { Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

type Props = {
  children?: ReactNode
  className?: string
  /** Disable orbit drag — useful for decorative backgrounds */
  interactive?: boolean
}

export function SceneCanvas({
  children,
  className = 'h-[320px] w-full',
  interactive = true,
}: Props) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#FFFFFF']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 3]} intensity={0.8} />
        <Suspense fallback={null}>{children}</Suspense>
        {interactive ? (
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.4} />
        ) : null}
      </Canvas>
    </div>
  )
}
