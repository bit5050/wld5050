import dynamic from 'next/dynamic'

/** SSR-safe R3F canvas — always import this in Server Components. */
export const SceneCanvas = dynamic(
  () => import('./scene-canvas').then((m) => m.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[320px] w-full items-center justify-center border border-border bg-muted/30 text-[12px] text-muted-foreground">
        Loading 3D…
      </div>
    ),
  }
)
