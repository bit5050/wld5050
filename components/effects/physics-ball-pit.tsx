'use client'

import { useEffect, useRef } from 'react'
import { Matter } from '@/lib/matter'

type Props = {
  className?: string
  ballCount?: number
}

/** Minimal Matter.js ball pit — interactive hero accent. */
export function PhysicsBallPit({ className = 'h-[280px] w-full', ballCount = 12 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter

    const engine = Engine.create()
    const render = Render.create({
      canvas,
      engine,
      options: {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        background: '#FFFFFF',
        wireframes: false,
      },
    })

    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const wall = 40

    const walls = [
      Bodies.rectangle(w / 2, h + wall / 2, w + wall * 2, wall, { isStatic: true }),
      Bodies.rectangle(w / 2, -wall / 2, w + wall * 2, wall, { isStatic: true }),
      Bodies.rectangle(-wall / 2, h / 2, wall, h + wall * 2, { isStatic: true }),
      Bodies.rectangle(w + wall / 2, h / 2, wall, h + wall * 2, { isStatic: true }),
    ]

    const balls = Array.from({ length: ballCount }, (_, i) =>
      Bodies.circle(w * 0.2 + (i % 4) * (w * 0.18), 40 + Math.floor(i / 4) * 30, 14, {
        restitution: 0.9,
        render: { fillStyle: i % 3 === 0 ? '#00C853' : '#000000' },
      })
    )

    Composite.add(engine.world, [...walls, ...balls])

    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    })
    Composite.add(engine.world, mouseConstraint)
    render.mouse = mouse

    const runner = Runner.create()
    Render.run(render)
    Runner.run(runner, engine)

    return () => {
      Render.stop(render)
      Runner.stop(runner)
      Engine.clear(engine)
      render.canvas.remove()
      render.textures = {}
    }
  }, [ballCount])

  return <canvas ref={canvasRef} className={className} aria-hidden />
}
