'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const codeLines = [
  'wld5050.eth → platform fee $10.00 USDC · 10.00 WLD',
  'agent.wld5050.eth → CRE draw agent',
  'World ID 4.0 → one entry per human',
  'CRE DON → 15/15 nodes consensus',
  'winner-round{N}.wld5050.eth → optional L1 badge (winner claims)',
  'ProveKit → ZK winner index verified',
  'Chainlink Confidential AI → fairness attestation',
  'Privy → embedded wallet · gasless ERC-4337',
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

type SectionBackgroundProps = {
  variant?: 'light' | 'dark'
}

function CodeStream({
  className,
  reverse = false,
  reducedMotion = false,
  codeClassName,
  opacityClassName,
}: {
  className?: string
  reverse?: boolean
  reducedMotion?: boolean
  codeClassName: string
  opacityClassName: string
}) {
  const lines = [...codeLines, ...codeLines]

  return (
    <div className={cn('pointer-events-none absolute overflow-hidden', opacityClassName, className)}>
      <motion.div
        className="flex flex-col gap-4 py-4"
        animate={reducedMotion ? undefined : { y: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
      >
        {lines.map((line, i) => (
          <span
            key={`${line}-${i}`}
            className={cn('block whitespace-nowrap font-mono text-[11px] leading-none tracking-wide', codeClassName)}
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
  inverted = false,
}: (typeof globes)[number] & { reducedMotion?: boolean; inverted?: boolean }) {
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
        className={cn(inverted ? 'opacity-[0.35] invert' : 'opacity-[0.26]')}
        unoptimized
        aria-hidden
      />
    </motion.div>
  )
}

export default function HeroBackground({ variant = 'light' }: SectionBackgroundProps) {
  const reducedMotion = useReducedMotion()
  const isDark = variant === 'dark'
  const gridOpacity = isDark ? 0.22 : 0.55
  const gridLine = isDark ? 'rgba(255,255,255,0.14)' : '#E0E0E0'
  const codeClassName = isDark ? 'text-[#9E9E9E]' : 'text-[#616161]'
  const codeStreamOpacity = isDark ? 'opacity-[0.45]' : 'opacity-[0.32]'
  const codeTickerOpacity = isDark ? 'opacity-[0.32]' : 'opacity-[0.24]'
  const codeTickerBottomOpacity = isDark ? 'opacity-[0.26]' : 'opacity-[0.2]'
  const fadeFrom = isDark ? 'from-black' : 'from-white'

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Hairline grid */}
      <div
        className="absolute inset-0"
        style={{
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(to right, ${gridLine} 0.5px, transparent 0.5px),
            linear-gradient(to bottom, ${gridLine} 0.5px, transparent 0.5px)
          `,
          backgroundSize: '56px 56px',
        }}
      />

      {/* Scrolling code columns */}
      <CodeStream
        className="left-0 top-0 hidden h-full w-[220px] md:block"
        reducedMotion={!!reducedMotion}
        codeClassName={codeClassName}
        opacityClassName={codeStreamOpacity}
      />
      <CodeStream
        className="right-0 top-0 hidden h-full w-[220px] md:block"
        reverse
        reducedMotion={!!reducedMotion}
        codeClassName={codeClassName}
        opacityClassName={codeStreamOpacity}
      />

      {/* Horizontal code ticker */}
      <div className={cn('absolute inset-x-0 top-[18%] hidden overflow-hidden lg:block', codeTickerOpacity)}>
        <motion.div
          className="flex w-max gap-10 whitespace-nowrap px-4"
          animate={reducedMotion ? undefined : { x: ['0%', '-50%'] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          {[...codeLines, ...codeLines].map((line, i) => (
            <span key={`h-${line}-${i}`} className={cn('font-mono text-[11px]', codeClassName)}>
              {line}
            </span>
          ))}
        </motion.div>
      </div>

      <div className={cn('absolute inset-x-0 bottom-[22%] hidden overflow-hidden lg:block', codeTickerBottomOpacity)}>
        <motion.div
          className="flex w-max gap-10 whitespace-nowrap px-4"
          animate={reducedMotion ? undefined : { x: ['-50%', '0%'] }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        >
          {[...codeLines, ...codeLines].map((line, i) => (
            <span key={`hb-${line}-${i}`} className={cn('font-mono text-[11px]', codeClassName)}>
              {line}
            </span>
          ))}
        </motion.div>
      </div>

      {globes.map((globe) => (
        <FloatingGlobe
          key={`${globe.top}-${globe.left}`}
          {...globe}
          reducedMotion={!!reducedMotion}
          inverted={isDark}
        />
      ))}

      {/* Soft edge fade so code/icons don't clash with text */}
      <div className={cn('absolute inset-y-0 left-0 w-[22%] bg-linear-to-r to-transparent', fadeFrom)} />
      <div className={cn('absolute inset-y-0 right-0 w-[22%] bg-linear-to-l to-transparent', fadeFrom)} />
      <div className={cn('absolute inset-x-0 top-0 h-20 bg-linear-to-b to-transparent', fadeFrom)} />
      <div className={cn('absolute inset-x-0 bottom-0 h-20 bg-linear-to-t to-transparent', fadeFrom)} />
    </div>
  )
}
