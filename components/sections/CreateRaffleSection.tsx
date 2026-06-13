'use client'

import { BlurFade } from '@/components/ui/blur-fade'
import HeroBackground from '@/components/sections/hero-background'
import CreateCard from '@/components/raffle/CreateCard'

export default function CreateRaffleSection() {
  return (
    <section className="relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px] border-[#2A2A2A] bg-black">
      <HeroBackground variant="dark" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
        <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
          <p className="font-mono text-[11px] text-[#9E9E9E] tracking-[0.2em] uppercase mb-3">
            Create a raffle
          </p>
          <h2 className="font-display text-[28px] font-semibold tracking-tight text-white mb-3 sm:text-[32px]">
            Launch your 50/50 on World Chain
          </h2>
          <p className="font-body text-[14px] leading-relaxed text-[#9E9E9E] max-w-[560px] mb-8">
            Pay the creation fee, set your raffle details, and go live. Chainlink CRE handles winner
            selection and payouts automatically.
          </p>
        </BlurFade>

        <BlurFade blur="0px" delay={0.1} inView inViewMargin="-80px">
          <CreateCard featured />
        </BlurFade>
      </div>
    </section>
  )
}
