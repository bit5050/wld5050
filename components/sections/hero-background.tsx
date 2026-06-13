'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const codeLines = [
  'wld5050.eth → platform fee $10.00 USDC',
  'agent.wld5050.eth → CRE draw agent',
  'World ID 4.0 → one entry per human',
  'CRE DON → 15/15 nodes consensus',
  'winner-round{N}.wld5050.eth → minted post-draw',
  'ProveKit → ZK winner index verified',
  'Chainlink Confidential AI → fairness attestation',
  'Privy → embedded wallet · gasless ERC-4337',
  'Blink → one-tap USDC deposit',
  'bit5050.eth → operator',
  'settle() → 50% winner · 50% creator',
  'no claim() → USDC pushed atomically',
]

const globes = [
  { top: '10%', left: '6%', size: 44, duration: 14, delay: 0 },
  { top: '18%', left: '78%', size: 36, duration: 11, delay: 1.2 },
  { top: '62%', left: '88%', size: 52, duration: 16, delay: 0.4 },
  { top: '72%', left: '12%', size: 32, duration: 12, delay: 2 },
  { top: '40%', left: '92%', size: 28, duration: 10, delay: 0.8 },
  { top: '8%', left: '42%', size: 24, duration: 13, delay: 1.6 },
  { top: '55%', left: '4%', size: 40, duration: 15, delay: 0.2 },
] as const

function CodeStream({
  className,
  reverse = false,
  reducedMotion = false,
}: {
  className?: string
  reverse?: boolean
  reducedMotion?: boolean
}) {
  const lines = [...codeLines, ...codeLines]

  return (
    <div className={cn('pointer-events-none absolute overflow-hidden opacity-[0.14]', className)}>
      <motion.div
        className="flex flex-col gap-4 py-4"
        animate={reducedMotion ? undefined : { y: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
      >
        {lines.map((line, i) => (
          <span
            key={`${line}-${i}`}
            className="block whitespace-nowrap font-mono text-[10px] leading-none text-[#616161] tracking-wide"
          >
            {line}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function FloatingGlobe({
  top,
  left,
  size,
  duration,
  delay,
  reducedMotion = false,
}: (typeof globes)[number] & { reducedMotion?: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ top, left, width: size, height: size }}
      animate={
        reducedMotion
          ? undefined
          : {
              y: [0, -14, 0, 10, 0],
              x: [0, 8, -6, 4, 0],
              rotate: [0, 4, -3, 2, 0],
            }
      }
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Image
        src="/images/WLD5050_favicon2.png"
        alt=""
        width={size}
        height={size}
        className="opacity-[0.12]"
        unoptimized
        aria-hidden
      />
    </motion.div>
  )
}

export default function HeroBackground() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Hairline grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E0E0E0 0.5px, transparent 0.5px),
            linear-gradient(to bottom, #E0E0E0 0.5px, transparent 0.5px)
          `,
          backgroundSize: '56px 56px',
        }}
      />

      {/* Scrolling code columns */}
      <CodeStream className="left-0 top-0 hidden h-full w-[220px] md:block" reducedMotion={!!reducedMotion} />
      <CodeStream
        className="right-0 top-0 hidden h-full w-[220px] md:block"
        reverse
        reducedMotion={!!reducedMotion}
      />

      {/* Horizontal code ticker */}
      <div className="absolute inset-x-0 top-[18%] hidden overflow-hidden opacity-[0.1] lg:block">
        <motion.div
          className="flex w-max gap-10 whitespace-nowrap px-4"
          animate={reducedMotion ? undefined : { x: ['0%', '-50%'] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          {[...codeLines, ...codeLines].map((line, i) => (
            <span key={`h-${line}-${i}`} className="font-mono text-[10px] text-[#616161]">
              {line}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-[22%] hidden overflow-hidden opacity-[0.08] lg:block">
        <motion.div
          className="flex w-max gap-10 whitespace-nowrap px-4"
          animate={reducedMotion ? undefined : { x: ['-50%', '0%'] }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        >
          {[...codeLines, ...codeLines].map((line, i) => (
            <span key={`hb-${line}-${i}`} className="font-mono text-[10px] text-[#616161]">
              {line}
            </span>
          ))}
        </motion.div>
      </div>

      {globes.map((globe) => (
        <FloatingGlobe key={`${globe.top}-${globe.left}`} {...globe} reducedMotion={!!reducedMotion} />
      ))}

      {/* Soft edge fade so code/icons don't clash with text */}
      <div className="absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-white to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[28%] bg-gradient-to-l from-white to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </div>
  )
}
