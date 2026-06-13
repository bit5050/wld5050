'use client'

import { BlurFade } from '@/components/ui/blur-fade'

const steps = [
  {
    step: '01',
    title: 'Create a raffle',
    body: 'Pay a $10.00 USDC creation fee. Set a name and duration. Your raffle is live onchain immediately. You earn 50% of every ticket sold Chainlink CRE pays you automatically when the round ends.',
  },
  {
    step: '02',
    title: 'Buy a ticket',
    body: 'Verify with World ID. Pay $2.50 USDC. One ticket per verified human the same person cannot enter twice, regardless of how many wallets they control.',
  },
  {
    step: '03',
    title: 'Get paid automatically',
    body: 'When the round ends, Chainlink CRE selects one winner from all ticket buyers. 50% of the pot goes to the winner. 50% goes to the creator. Both payments arrive in the same transaction no button to press.',
  },
] as const

const poweredBy = ['World ID', 'Chainlink CRE', 'World Chain', 'ENS'] as const

export default function HowItWorksSection() {
  return (
    <section className="relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px] border-[#E0E0E0] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
        <BlurFade blur="0px" delay={0} inView>
          <p className="font-mono text-[11px] text-[#9E9E9E] tracking-[0.2em] uppercase mb-3">
            How it works
          </p>
          <h2 className="font-display text-[28px] font-semibold tracking-tight mb-10 sm:text-[32px]">
            Three steps. Fully automated.
          </h2>
        </BlurFade>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
          {steps.map(({ step, title, body }, index) => (
            <BlurFade key={step} blur="0px" delay={0.08 + index * 0.06} inView>
              <article className="group relative flex h-full flex-col rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 transition-colors hover:border-black sm:p-7 lg:p-8">
                <span className="font-mono text-[11px] font-bold tracking-widest text-[#9E9E9E] mb-4">
                  {step}
                </span>
                <h3 className="font-display text-[18px] font-semibold tracking-tight text-black mb-3 lg:text-[20px]">
                  {title}
                </h3>
                <p className="font-body text-[13px] leading-relaxed text-[#616161] lg:text-[14px]">
                  {body}
                </p>
                <div className="mt-auto pt-6">
                  <div className="h-px w-full bg-[#E0E0E0] transition-colors group-hover:bg-black" />
                </div>
              </article>
            </BlurFade>
          ))}
        </div>

        <BlurFade blur="0px" delay={0.28} inView inViewMargin="-80px">
          <div className="mt-10 border-t border-[0.5px] border-[#E0E0E0] pt-5">
            <div className="flex flex-col items-center justify-center gap-3 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-4 sm:flex-row sm:gap-4">
              <span className="font-mono text-[10px] text-[#9E9E9E] uppercase tracking-[0.2em] shrink-0">
                Powered by
              </span>
              <span
                className="hidden h-3 w-px bg-[#E0E0E0] sm:inline-block"
                aria-hidden
              />
              <p className="font-mono text-[11px] text-[#616161] tracking-wide text-center sm:text-left">
                {poweredBy.join(' · ')}
              </p>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
