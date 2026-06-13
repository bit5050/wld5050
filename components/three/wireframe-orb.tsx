'use client'

/** Minimal wireframe scene — drop inside `<SceneCanvas>`. */
export function WireframeOrb() {
  return (
    <mesh rotation={[0.4, 0.6, 0]}>
      <icosahedronGeometry args={[1.1, 1]} />
      <meshStandardMaterial color="#000000" wireframe />
    </mesh>
  )
}
