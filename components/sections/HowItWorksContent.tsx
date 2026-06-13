'use client'

import Link from 'next/link'
import {
  AtSign,
  ArrowRight,
  Coins,
  Fingerprint,
  Link2,
  ScanFace,
  ShieldCheck,
  Ticket,
  Wallet,
  Zap,
} from 'lucide-react'
import { BlurFade } from '@/components/ui/blur-fade'
import { StatsMarquee } from '@/components/effects/stats-marquee'
import HeroBackground from '@/components/sections/hero-background'
import { cn } from '@/lib/utils'

const flowMarquee = [
  'World ID verified',
  '$10.00 USDC · 10 WLD create',
  '$2.50 USDC · 2.50 WLD per ticket',
  '50% winner · 50% creator',
  'Chainlink CRE settlement',
  'ENS winner subnames',
  'No claiming step',
  'World Chain mainnet',
] as const

const steps = [
  {
    step: '01',
    icon: ScanFace,
    title: 'Verify with World ID',
    body:
      'Every creator and ticket buyer proves they are a unique, Orb-verified human using a zero-knowledge proof. One person, one entry per raffle — no bots, no Sybil wallets.',
  },
  {
    step: '02',
    icon: Wallet,
    title: 'Create a raffle',
    body:
      'Choose USDC or WLD as the raffle currency. Pay the flat creation fee ($10.00 USDC or 10 WLD to wld5050.eth), set a name and duration (1 hour to 7 days). Your raffle is live on-chain immediately.',
  },
  {
    step: '03',
    icon: Ticket,
    title: 'Buy a ticket',
    body:
      'Verify with World ID, then pay $2.50 USDC or 2.50 WLD per ticket. Funds sit in escrow until settlement. The same human cannot buy twice — nullifier hashes are checked on-chain.',
  },
  {
    step: '04',
    icon: Zap,
    title: 'CRE settles automatically',
    body:
      'When the deadline passes, Chainlink CRE selects a verifiable random winner, splits ticket revenue 50/50, and pushes payouts to winner and creator in one atomic transaction. No claim button.',
  },
] as const

const pricingRows = [
  {
    label: 'Create raffle',
    usdc: '$10.00',
    wld: '10.00 WLD',
    note: 'Paid to wld5050.eth (platform fee)',
  },
  {
    label: 'Ticket price',
    usdc: '$2.50',
    wld: '2.50 WLD',
    note: 'Held in escrow until settlement',
  },
  {
    label: 'Winner receives',
    usdc: '50% of ticket sales',
    wld: '50% of ticket sales',
    note: 'Pushed automatically by CRE',
  },
  {
    label: 'Creator receives',
    usdc: '50% of ticket sales',
    wld: '50% of ticket sales',
    note: 'Pushed automatically by CRE',
  },
] as const

const settlementExamples = [
  { tickets: 1, usdc: '$1.25', wld: '1.25 WLD' },
  { tickets: 10, usdc: '$12.50', wld: '12.50 WLD' },
  { tickets: 100, usdc: '$125.00', wld: '125.00 WLD' },
  { tickets: 1000, usdc: '$1,250.00', wld: '1,250 WLD' },
] as const

const integrations = [
  {
    icon: Coins,
    title: 'USDC & WLD',
    tag: 'Dual-token escrow',
    body:
      'Creators pick USDC or WLD when launching a raffle. All tickets and payouts use the same token — simple escrow, no swaps inside the contract. Fixed amounts on-chain: no oracle dependency on World Chain.',
    bullets: [
      'USDC · 6 decimals · World Chain native',
      'WLD · 18 decimals · World Chain native',
      'Frontend handles token approvals before each tx',
    ],
  },
  {
    icon: Link2,
    title: 'Chainlink CRE',
    tag: 'Automation & randomness',
    body:
      'Winner selection and prize distribution run on Chainlink\'s Decentralized Oracle Network via the Chainlink Runtime Environment. CRE workflows read expired raffles, generate verifiable randomness, and call onReport() through the Keystone Forwarder.',
    bullets: [
      'Hourly cron trigger on expired raffles',
      'BFT consensus randomness (runtime.Rand)',
      'Confidential AI fairness attestation hash on-chain',
      'Atomic USDC/WLD push to winner + creator',
    ],
  },
  {
    icon: AtSign,
    title: 'ENS',
    tag: 'Readable identities',
    body:
      'ENS replaces raw hex addresses across the UI. When CRE settles a raffle, the contract emits a winner subname — winner-round{N}.wld5050.eth — minted on Ethereum L1 and pointed at the winner\'s address.',
    bullets: [
      'Hosts, buyers, and winners shown by ENS name',
      'winner-round{N}.wld5050.eth minted post-draw',
      'Permanent on-chain identity for every winner',
    ],
  },
] as const

const crePipeline = [
  'CRE workflow reads getExpiredRaffles() on World Chain',
  'AgentKit human-backed verification check',
  'Confidential AI fairness attestation (TEE)',
  'Verifiable randomness via CRE DON consensus',
  'onReport() → winner + creator paid in one tx',
  'RaffleSettled event → ENS subname minted on L1',
] as const

function SectionShell({
  children,
  className,
  dark = false,
  id,
}: {
  children: React.ReactNode
  className?: string
  dark?: boolean
  id?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px]',
        dark ? 'border-[#2A2A2A] bg-black' : 'border-[#E0E0E0] bg-white',
        className
      )}
    >
      {children}
    </section>
  )
}

function SectionInner({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-16 lg:px-14', className)}>
      {children}
    </div>
  )
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={cn(
        'font-mono text-[11px] tracking-[0.2em] uppercase mb-3',
        dark ? 'text-[#9E9E9E]' : 'text-[#9E9E9E]'
      )}
    >
      {children}
    </p>
  )
}

function SectionTitle({
  children,
  dark = false,
  className,
}: {
  children: React.ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <h2
      className={cn(
        'font-display text-[28px] font-semibold tracking-tight sm:text-[32px]',
        dark ? 'text-white' : 'text-black',
        className
      )}
    >
      {children}
    </h2>
  )
}

function BodyText({
  children,
  className,
  dark = false,
}: {
  children: React.ReactNode
  className?: string
  dark?: boolean
}) {
  return (
    <p
      className={cn(
        'font-body text-[14px] leading-relaxed lg:text-[15px]',
        dark ? 'text-[#9E9E9E]' : 'text-[#616161]',
        className
      )}
    >
      {children}
    </p>
  )
}

export default function HowItWorksContent() {
  return (
    <>
      {/* Hero */}
      <SectionShell>
        <HeroBackground />
        <SectionInner className="relative z-10 py-16 lg:py-20">
          <BlurFade blur="0px" delay={0} inView>
            <SectionLabel>Guide</SectionLabel>
            <h1 className="font-display text-[40px] font-bold leading-[1.12] tracking-tight mb-5 sm:text-[44px] lg:text-[48px]">
              How It Works
            </h1>
            <BodyText className="max-w-[640px]">
              Human-verified 50/50 raffles on World Chain — verify once, pay in USDC or WLD, and let
              Chainlink CRE handle the draw and payouts automatically.
            </BodyText>
          </BlurFade>

          <BlurFade blur="0px" delay={0.12} inView>
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                { icon: Fingerprint, label: '1 human · 1 ticket' },
                { icon: Coins, label: 'USDC or WLD' },
                { icon: ShieldCheck, label: 'CRE verified draw' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-2.5"
                >
                  <Icon className="h-4 w-4 text-black" strokeWidth={1.5} />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#616161]">
                    {label}
                  </span>
                </span>
              ))}
            </div>
          </BlurFade>
        </SectionInner>
      </SectionShell>

      {/* Steps */}
      <SectionShell id="steps">
        <StatsMarquee items={[...flowMarquee]} className="border-[#E0E0E0] bg-[#FAFAFA]" />
        <SectionInner>
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <SectionLabel>Flow</SectionLabel>
            <SectionTitle className="mb-3">Four steps. Fully automated.</SectionTitle>
            <BodyText className="max-w-[640px] mb-10">
              From World ID verification to automatic settlement — every step is on-chain and
              trustless.
            </BodyText>
          </BlurFade>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {steps.map(({ step, icon: Icon, title, body }, index) => (
              <BlurFade
                key={step}
                blur="0px"
                delay={0.06 + index * 0.05}
                inView
                inViewMargin="-80px"
              >
                <article
                  className="group flex h-full flex-col rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 transition-colors hover:border-black sm:p-7"
                >
                  <span className="font-mono text-[11px] font-bold tracking-widest text-[#9E9E9E] mb-4">
                    {step}
                  </span>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0] transition-colors group-hover:border-black">
                    <Icon className="h-[18px] w-[18px] text-black" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-[17px] font-semibold tracking-tight text-black mb-3 lg:text-[18px]">
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
        </SectionInner>
      </SectionShell>

      {/* Pricing */}
      <SectionShell id="pricing">
        <SectionInner>
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <SectionLabel>Pricing</SectionLabel>
            <SectionTitle className="mb-3">Fixed fees. Transparent splits.</SectionTitle>
            <BodyText className="max-w-[640px] mb-10">
              All amounts are hardcoded in the contract — no hidden fees, no oracle conversions.
              Creators choose USDC or WLD at raffle creation; every ticket and payout uses that same
              token.
            </BodyText>
          </BlurFade>

          <BlurFade blur="0px" delay={0.06} inView inViewMargin="-80px">
            <div className="overflow-hidden rounded-[10px] border-[0.5px] border-[#E0E0E0]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA]">
                    <th className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] px-5 py-4 sm:px-6">
                      Action
                    </th>
                    <th className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] px-5 py-4 sm:px-6">
                      USDC
                    </th>
                    <th className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] px-5 py-4 sm:px-6">
                      WLD
                    </th>
                    <th
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] px-5 py-4 sm:px-6 hidden lg:table-cell"
                    >
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pricingRows.map((row, index) => (
                    <tr
                      key={row.label}
                      className={cn(
                        index < pricingRows.length - 1 && 'border-b border-[0.5px] border-[#E0E0E0]'
                      )}
                    >
                      <td className="font-display text-[15px] font-semibold text-black px-5 py-4 sm:px-6 sm:py-5">
                        {row.label}
                      </td>
                      <td className="font-mono text-[14px] font-bold text-black px-5 py-4 sm:px-6 sm:py-5">
                        {row.usdc}
                      </td>
                      <td className="font-mono text-[14px] font-bold text-black px-5 py-4 sm:px-6 sm:py-5">
                        {row.wld}
                      </td>
                      <td className="font-body text-[13px] text-[#616161] px-5 py-4 sm:px-6 sm:py-5 hidden lg:table-cell">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BlurFade>

          <BlurFade blur="0px" delay={0.12} inView inViewMargin="-80px">
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {settlementExamples.map(({ tickets, usdc, wld }) => (
                <div
                  key={tickets}
                  className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-5 sm:p-6"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-2">
                    {tickets} ticket{tickets !== 1 ? 's' : ''} sold
                  </p>
                  <p className="font-display text-[13px] font-semibold text-black mb-1">
                    Winner + creator each receive
                  </p>
                  <p className="font-mono text-[15px] font-bold text-black">{usdc}</p>
                  <p className="font-mono text-[13px] text-[#616161] mt-0.5">or {wld}</p>
                </div>
              ))}
            </div>
            <p className="font-body text-[13px] text-[#9E9E9E] mt-6">
              Creation fee is separate from ticket revenue — platform earns $10.00 USDC or 10 WLD per
              raffle created.
            </p>
          </BlurFade>
        </SectionInner>
      </SectionShell>

      {/* Integrations */}
      <SectionShell id="integrations">
        <SectionInner>
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <SectionLabel>Integrations</SectionLabel>
            <SectionTitle className="mb-3">USDC, WLD, CRE, and ENS</SectionTitle>
            <BodyText className="max-w-[640px] mb-10">
              Three integrations power every raffle — dual-token payments, trustless settlement,
              and human-readable identities.
            </BodyText>
          </BlurFade>

          <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
            {integrations.map(({ icon: Icon, title, tag, body, bullets }, index) => (
              <BlurFade
                key={title}
                blur="0px"
                delay={0.06 + index * 0.06}
                inView
                inViewMargin="-80px"
              >
                <article
                  className="group flex h-full flex-col rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 transition-colors hover:border-black sm:p-7"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0] transition-colors group-hover:border-black">
                    <Icon className="h-[18px] w-[18px] text-black" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-[17px] font-semibold tracking-tight text-black mb-1">
                    {title}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#9E9E9E] mb-3">
                    {tag}
                  </p>
                  <p className="font-body text-[13px] leading-relaxed text-[#616161] mb-4 lg:text-[14px]">
                    {body}
                  </p>
                  <ul className="space-y-2 mt-auto">
                    {bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 font-body text-[12px] leading-relaxed text-[#616161] lg:text-[13px]"
                      >
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#9E9E9E]"
                          strokeWidth={1.5}
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              </BlurFade>
            ))}
          </div>
        </SectionInner>
      </SectionShell>

      {/* CRE Pipeline */}
      <SectionShell dark>
        <HeroBackground variant="dark" />
        <SectionInner className="relative z-10">
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-[10px] border-[0.5px] border-[#2A2A2A] bg-black">
              <Link2 className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
            <SectionLabel dark>Chainlink CRE</SectionLabel>
            <SectionTitle dark className="mb-5 max-w-[720px]">
              Settlement pipeline
            </SectionTitle>
            <BodyText dark className="max-w-[640px] mb-10">
              When a raffle ends, CRE runs the full draw and payout flow without any human operator.
              USDC or WLD is pushed to winner and creator in the same transaction.
            </BodyText>
          </BlurFade>

          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {crePipeline.map((step, index) => (
              <BlurFade
                key={step}
                blur="0px"
                delay={0.04 + index * 0.04}
                inView
                inViewMargin="-80px"
              >
                <li
                  className="flex gap-4 rounded-[10px] border-[0.5px] border-[#2A2A2A] bg-black p-5 transition-colors hover:border-[#616161]"
                >
                  <span className="font-mono text-[11px] font-bold tracking-widest text-[#9E9E9E] shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-body text-[13px] leading-relaxed text-[#9E9E9E] lg:text-[14px]">
                    {step}
                  </span>
                </li>
              </BlurFade>
            ))}
          </ol>

          <BlurFade blur="0px" delay={0.28} inView inViewMargin="-80px">
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/create">
                <button
                  type="button"
                  className="font-body text-[14px] font-medium px-6 py-3 bg-white text-black rounded-[10px] border border-white hover:opacity-80 transition-opacity"
                >
                  Create a raffle
                </button>
              </Link>
              <Link href="/">
                <button
                  type="button"
                  className="font-body text-[14px] font-medium px-6 py-3 bg-black text-white rounded-[10px] border-[0.5px] border-[#2A2A2A] hover:border-white transition-colors"
                >
                  Browse raffles
                </button>
              </Link>
            </div>
          </BlurFade>
        </SectionInner>
      </SectionShell>
    </>
  )
}
