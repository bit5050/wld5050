'use client'

import { BotOff, Fingerprint, ShieldCheck, Zap } from 'lucide-react'
import { BlurFade } from '@/components/ui/blur-fade'

const cards = [
  {
    icon: Fingerprint,
    title: 'One human. One ticket.',
    body: 'World ID verifies that every entrant is a unique real person using a zero-knowledge proof of personhood. The same human cannot enter twice — even with 1,000 wallets.',
  },
  {
    icon: BotOff,
    title: 'No admin. No keeper.',
    body: 'Chainlink CRE runs on a Decentralized Oracle Network of 15 independent nodes. No single party can delay, block, or manipulate the draw. The protocol runs itself.',
  },
  {
    icon: Zap,
    title: 'Automatic payouts.',
    body: 'Winner and creator both receive USDC in the same atomic transaction that selects the winner. There is no claiming step. There is no withdrawal page. The money arrives.',
  },
  {
    icon: ShieldCheck,
    title: 'ZK-verified draw.',
    body: 'ProveKit generates a zero-knowledge proof that the winning index was derived correctly from the committed randomness seed. Anyone can verify the draw was honest — in their browser.',
  },
] as const

export default function TrustSection() {
  return (
    <section className="relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px] border-[#E0E0E0] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
        <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
          <p className="font-mono text-[11px] text-[#9E9E9E] tracking-[0.2em] uppercase mb-3">
            Why it&apos;s fair
          </p>
          <h2 className="font-display text-[28px] font-semibold tracking-tight mb-3 sm:text-[32px]">
            Why WLD5050 is different
          </h2>
          <p className="font-body text-[14px] leading-relaxed text-[#616161] max-w-[640px] mb-10">
            Most on-chain raffles are not fair. Bots and whale wallets flood the entry pool. The admin
            can delay or withhold the draw. There is no proof the winner was selected honestly.
          </p>
        </BlurFade>

        <BlurFade blur="0px" delay={0.08} inView inViewMargin="-80px">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            {cards.map(({ icon: Icon, title, body }, index) => (
              <article
                key={title}
                className="group flex h-full flex-col rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 transition-colors hover:border-black sm:p-7"
              >
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#9E9E9E] mb-3">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0] transition-colors group-hover:border-black">
                  <Icon className="h-[18px] w-[18px] text-black" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-[16px] font-semibold tracking-tight text-black mb-2 lg:text-[17px]">
                  {title}
                </h3>
                <p className="font-body text-[13px] leading-relaxed text-[#616161] lg:text-[14px]">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
