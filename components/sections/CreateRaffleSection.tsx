'use client'

import { BlurFade } from '@/components/ui/blur-fade'
import HeroBackground from '@/components/sections/hero-background'
import CreateRaffleForm from '@/components/raffle/CreateRaffleForm'

export default function CreateRaffleSection() {
  return (
    <section
      id="create-raffle"
      className="relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px] border-[#2A2A2A] bg-black"
    >
      <HeroBackground variant="dark" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
        <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
          <p className="font-mono text-[11px] text-[#9E9E9E] tracking-[0.2em] uppercase mb-3">
            Create your own raffle
          </p>
          <h2 className="font-display text-[28px] font-semibold tracking-tight text-white mb-3 sm:text-[32px]">
            Launch A 50/50 Raffle On World Chain
          </h2>
          <p className="font-body text-[14px] leading-relaxed text-[#9E9E9E] max-w-[560px] mb-8">
            Set your raffle name and schedule, then pay the creation fee in USDC or WLD. World ID
            verification required. Chainlink CRE handles the draw and payouts automatically.
          </p>
        </BlurFade>

        <BlurFade blur="0px" delay={0.1} inView inViewMargin="-80px">
          <CreateRaffleForm variant="section" />
        </BlurFade>
      </div>
    </section>
  )
}
