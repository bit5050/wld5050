'use client'

import Link from 'next/link'
import { BlurFade } from '@/components/ui/blur-fade'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import HeroBackground from '@/components/sections/hero-background'

const stats = [
  { value: '$10.00 USDC', label: 'Create your own raffle' },
  { value: '$2.50', label: 'per ticket' },
  { value: '50%', label: 'to winner' },
  { value: '50%', label: 'to creator' },
] as const

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex flex-col gap-1 shrink-0">
      <span className="font-mono text-[22.5px] font-bold tracking-tight text-black">{value}</span>
      <span className="font-body text-[16.5px] text-[#9E9E9E] uppercase tracking-widest">{label}</span>
    </span>
  )
}

export default function HeroSection() {
  return (
    <section className="relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px] border-[#E0E0E0] bg-white">
      <HeroBackground />

      <div className="relative z-10 mx-auto max-w-[1120px] px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
        <div className="max-w-[720px]">
          <BlurFade blur="0px" delay={0} inView>
            <p className="font-mono text-[11px] text-[#9E9E9E] tracking-[0.2em] uppercase mb-5">
              World Chain · Chainlink CRE · ENS
            </p>
          </BlurFade>

          <BlurFade blur="0px" delay={0.06} inView>
            <h1 className="font-display text-[40px] font-bold leading-[1.12] tracking-tight mb-5 sm:text-[44px] lg:text-[48px]">
              Human-Only 50/50 Raffles on World Chain.
              <br />
              <span className="text-[#9E9E9E]">
                Verified by World ID. Powered by Chainlink. Readable by ENS.
              </span>
            </h1>
          </BlurFade>

          <BlurFade blur="0px" delay={0.12} inView>
            <p className="font-body text-[14px] text-[#616161] leading-relaxed max-w-[520px] mb-8 lg:text-[15px]">
              Create a 50/50 raffle or buy tickets. World ID guarantees verified human raffles.
              Chainlink CRE selects the winner and pays out automatically no claiming, no waiting.
            </p>
          </BlurFade>

          <BlurFade blur="0px" delay={0.18} inView>
            <div className="flex flex-wrap gap-3">
              <Link href="/create">
                <button
                  type="button"
                  className="font-body text-[14px] font-medium px-6 py-3 bg-black text-white rounded-[10px] border border-black hover:opacity-80 transition-opacity"
                >
                  Create a raffle
                </button>
              </Link>
              <Link href="#raffles">
                <button
                  type="button"
                  className="font-body text-[14px] font-medium px-6 py-3 bg-white text-black rounded-[10px] border-[0.5px] border-[#E0E0E0] hover:border-black transition-colors"
                >
                  Browse raffles
                </button>
              </Link>
            </div>
          </BlurFade>
        </div>

        <BlurFade blur="0px" delay={0.24} inView>
          <div className="mt-14 pt-8 border-t border-[0.5px] border-[#E0E0E0] lg:mt-16">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-wrap items-end gap-x-5 gap-y-4">
                {stats.map(({ value, label }, index) => (
                  <span key={label} className="inline-flex items-end gap-5">
                    {index > 0 && (
                      <span
                        className="font-mono text-[19.5px] text-[#9E9E9E] pb-1 select-none"
                        aria-hidden
                      >
                        |
                      </span>
                    )}
                    <StatItem value={value} label={label} />
                  </span>
                ))}
              </div>
              <VerifiedBadge label="World ID verified" />
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
