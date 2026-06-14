'use client'

import Link from 'next/link'
import {
  AtSign,
  Blocks,
  Building2,
  Fingerprint,
  Globe,
  Layers,
  Link2,
  ScanFace,
  ShieldCheck,
  Ticket,
  Users,
} from 'lucide-react'
import { BlurFade } from '@/components/ui/blur-fade'
import { NumberTicker } from '@/components/ui/number-ticker'
import { StatsMarquee } from '@/components/effects/stats-marquee'
import HeroBackground from '@/components/sections/hero-background'
import { cn } from '@/lib/utils'

const ecosystemMarquee = [
  'Ethereum',
  'Base',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'World Chain',
  'BNB Chain',
  'Avalanche',
  'Solana',
  '17+ ecosystems',
  'BIT5050 INC.',
  'All Product. All Service. No Token.',
] as const

const poweredBy = [
  {
    icon: ScanFace,
    name: 'Worldcoin',
    tag: 'World ID Integration',
    body:
      'WLD5050 integrates World ID as its proof-of-humanity gate. Using World ID\'s zero-knowledge credential system, every raffle participant is verified as a unique, real human being without revealing any personal information. Sybil resistance isn\'t a feature, it\'s the foundation.',
  },
  {
    icon: Link2,
    name: 'Chainlink',
    tag: 'Chainlink Runtime Environment (CRE)',
    body:
      'Winner selection and prize distribution on WLD5050 are powered by Chainlink CRE, Chainlink\'s automation and verifiable randomness infrastructure. Every winner is chosen through a tamper-proof, cryptographically verifiable random process, and prize funds are distributed automatically on-chain. No manual payouts. No operator interference. Just trustless execution.',
  },
  {
    icon: AtSign,
    name: 'ENS',
    tag: 'Ethereum Name Service',
    body:
      'WLD5050 integrates ENS to replace raw wallet addresses with human-readable identities throughout the platform. Participants, hosts, and winners are displayed by their ENS names, making every raffle more legible, more personal, and more Web3-native. Your name on-chain, not just your hash.',
  },
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

function SectionInner({ children, className }: { children: React.ReactNode; className?: string }) {
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

export default function AboutContent() {
  return (
    <>
      {/* Hero */}
      <SectionShell>
        <HeroBackground />
        <SectionInner className="relative z-10 py-16 lg:py-20">
          <BlurFade blur="0px" delay={0} inView>
            <SectionLabel>About</SectionLabel>
            <h1 className="font-display text-[40px] font-bold leading-[1.12] tracking-tight mb-5 sm:text-[44px] lg:text-[48px]">
              About Us
              <br />
              <span className="text-[#9E9E9E]">WLD5050</span>
            </h1>
            <BodyText className="max-w-[640px]">
              Human-verified 50/50 raffles on World Chain. Where every entrant is a real person and
              every winner is chosen with provably fair, automated randomness.
            </BodyText>
          </BlurFade>

          <BlurFade blur="0px" delay={0.12} inView>
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                { icon: Fingerprint, label: 'World ID verified' },
                { icon: ShieldCheck, label: 'CRE automated draws' },
                { icon: Globe, label: 'World Chain native' },
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

      {/* What Is WLD5050 */}
      <SectionShell id="what-is">
        <SectionInner>
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <SectionLabel>Protocol</SectionLabel>
            <SectionTitle className="mb-6">What Is WLD5050?</SectionTitle>
            <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:gap-12 lg:items-start">
              <div className="space-y-5">
                <BodyText>
                  WLD5050 is a human-verified, on-chain 50/50 raffle protocol built on World Chain,
                  where every participant is a real, verified human being, and every winner is selected
                  with provably fair, automated randomness.
                </BodyText>
                <BodyText>
                  Born at the ETH Global Hackathon NYC on June 12–13, 2026, WLD5050 represents the
                  next evolution of the BIT5050 ecosystem: a raffle experience that doesn&apos;t just
                  prevent bots, it guarantees humanity.
                </BodyText>
              </div>
              <aside
                className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 lg:p-7"
                aria-label="Hackathon origin"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0]">
                  <Layers className="h-[18px] w-[18px] text-black" strokeWidth={1.5} />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-2">
                  ETHGlobal NYC
                </p>
                <p className="font-display text-[20px] font-semibold tracking-tight text-black mb-1">
                  June 12–13, 2026
                </p>
                <p className="font-body text-[13px] leading-relaxed text-[#616161]">
                  Built in 36 hours. Shipped on World Chain mainnet.
                </p>
              </aside>
            </div>
          </BlurFade>
        </SectionInner>
      </SectionShell>

      {/* BIT5050 Ecosystem */}
      <SectionShell dark>
        <HeroBackground variant="dark" />
        <StatsMarquee
          items={[...ecosystemMarquee]}
          className="relative z-10 border-[#2A2A2A] bg-[#111111] [&_span]:text-[#9E9E9E]"
        />
        <SectionInner className="relative z-10">
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
              <div>
                <SectionLabel dark>Ecosystem</SectionLabel>
                <SectionTitle dark className="mb-5">Part of the BIT5050 Ecosystem</SectionTitle>
                <div className="space-y-5">
                  <BodyText dark>
                    WLD5050 is proudly built by BIT5050 INC., a Delaware C-Corp and the world&apos;s
                    leading multi-chain Web3 50/50 raffle protocol, currently deployed across{' '}
                    <NumberTicker
                      value={17}
                      className="font-mono font-bold text-white"
                    />{' '}
                    blockchain ecosystems.
                  </BodyText>
                  <BodyText dark>
                    BIT5050 operates under one founding philosophy:
                  </BodyText>
                  <blockquote
                    className="rounded-[10px] border-[0.5px] border-[#2A2A2A] bg-[#111111] px-5 py-4"
                  >
                    <p className="font-display text-[18px] font-semibold tracking-tight text-white sm:text-[20px]">
                      &ldquo;All Product. All Service. No Token.&rdquo;
                    </p>
                  </blockquote>
                  <BodyText dark>
                    BIT5050 provides Web3 raffle platforms for creators, influencers, live streamers,
                    NFT &amp; DAO communities, organizations, and events, including live events. No
                    governance token. No speculation. Just infrastructure that works.
                  </BodyText>
                  <BodyText dark>
                    WLD5050 carries that philosophy directly onto World Chain, combining BIT5050&apos;s
                    battle-tested raffle architecture with World ID&apos;s proof-of-humanity layer to
                    deliver the most trusted raffle experience in Web3.
                  </BodyText>
                </div>
              </div>

              <aside
                className="rounded-[10px] border-[0.5px] border-[#2A2A2A] bg-[#111111] p-6 sm:p-8"
                aria-label="BIT5050 at a glance"
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[10px] border-[0.5px] border-[#2A2A2A]">
                  <Building2 className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white mb-1">
                  BIT5050 INC.
                </p>
                <p className="font-display text-[22px] font-semibold tracking-tight text-white mb-6">
                  Delaware C-Corp
                </p>
                <dl className="space-y-4">
                  <div className="flex items-baseline justify-between gap-4 border-b border-[0.5px] border-[#2A2A2A] pb-4">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-[#9E9E9E]">
                      Chains
                    </dt>
                    <dd className="font-mono text-[22px] font-bold text-white">
                      <NumberTicker value={17} className="text-white" />+
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[0.5px] border-[#2A2A2A] pb-4">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-[#9E9E9E]">
                      Model
                    </dt>
                    <dd className="font-body text-[14px] text-white">50/50 raffle protocol</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-[#9E9E9E]">
                      Token
                    </dt>
                    <dd className="font-body text-[14px] text-white">None</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </BlurFade>
        </SectionInner>
      </SectionShell>

      {/* Built for Humans */}
      <SectionShell>
        <SectionInner>
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <SectionLabel>Identity layer</SectionLabel>
            <SectionTitle className="mb-5">Built for Humans. Verified On-Chain.</SectionTitle>
            <div className="grid gap-5 lg:grid-cols-2">
              <article
                className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 sm:p-7"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0]">
                  <Users className="h-[18px] w-[18px] text-black" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-[17px] font-semibold tracking-tight text-black mb-3">
                  The problem
                </h3>
                <BodyText>
                  The problem with most on-chain raffles isn&apos;t the contract, it&apos;s the crowd.
                  Bots, scripts, and Sybil wallets flood entry pools, diluting real participants and
                  undermining trust.
                </BodyText>
              </article>
              <article
                className="rounded-[10px] border-[0.5px] border-black bg-white p-6 sm:p-7"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border-[0.5px] border-black bg-black">
                  <Fingerprint className="h-[18px] w-[18px] text-white" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-[17px] font-semibold tracking-tight text-black mb-3">
                  The WLD5050 solution
                </h3>
                <BodyText>
                  WLD5050 solves this at the identity layer. Every wallet that enters a WLD5050 raffle
                  must hold a valid World ID credential, a zero-knowledge proof of unique humanness.
                  No verification, no entry. It&apos;s that simple.
                </BodyText>
                <BodyText className="mt-4">
                  The result: a raffle pool made entirely of real people, where your odds are determined
                  by participation, not by how many wallets someone spun up.
                </BodyText>
              </article>
            </div>
          </BlurFade>
        </SectionInner>
      </SectionShell>

      {/* One entry per human */}
      <SectionShell id="one-entry">
        <SectionInner>
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <SectionLabel>Fair entry</SectionLabel>
            <SectionTitle className="mb-5">One ticket per verified human</SectionTitle>
            <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-12 lg:items-start">
              <div className="space-y-5">
                <BodyText>
                  Every WLD5050 raffle follows the same rule:{' '}
                  <strong className="font-medium text-black">one entry per real human, per round</strong>.
                  The app shows a single &ldquo;Buy ticket&rdquo; button — no quantity picker — because
                  each verified World ID can only purchase one ticket in that raffle.
                </BodyText>
                <BodyText>
                  That limit is enforced on-chain, not just in the UI. When you buy a ticket, the
                  contract stores your World ID nullifier for that raffle. A second purchase with the
                  same identity reverts — even from a different wallet.
                </BodyText>
                <BodyText>
                  <strong className="font-medium text-black">Why?</strong> This is the core WLD5050
                  design: fair odds for real participants. Bots and multi-wallet Sybil entries cannot
                  stack tickets in a single raffle to inflate their chances.
                </BodyText>
                <BodyText>
                  You can still enter many raffles over time — one ticket per raffle — but never more
                  than one in the same round. Supporting &ldquo;buy N tickets&rdquo; in one raffle would
                  require a smart contract change and a deliberate product decision about whether that
                  fits a human-verified model. Today it is strictly one-to-one.
                </BodyText>
              </div>

              <aside
                className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] p-6 lg:p-7"
                aria-label="Entry rules"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white">
                  <Ticket className="h-[18px] w-[18px] text-black" strokeWidth={1.5} />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-4">
                  Per raffle
                </p>
                <ul className="space-y-3 font-body text-[13px] leading-relaxed text-[#616161]">
                  <li className="flex gap-2">
                    <span className="text-black shrink-0">✓</span>
                    <span>One ticket after World ID verification</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-black shrink-0">✓</span>
                    <span>Enter unlimited different raffles</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#9E9E9E] shrink-0">✗</span>
                    <span>Multiple tickets in the same raffle</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#9E9E9E] shrink-0">✗</span>
                    <span>Extra entries via additional wallets (same World ID)</span>
                  </li>
                </ul>
                <p className="mt-5 border-t border-[#E0E0E0] pt-4 font-mono text-[11px] leading-relaxed text-[#9E9E9E]">
                  Enforced by World ID nullifiers in the WLD5050 smart contract on World Chain.
                </p>
              </aside>
            </div>
          </BlurFade>
        </SectionInner>
      </SectionShell>

      {/* Powered By */}
      <SectionShell id="powered-by">
        <SectionInner>
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <SectionLabel>Stack</SectionLabel>
            <SectionTitle className="mb-3">Powered By</SectionTitle>
            <BodyText className="max-w-[640px] mb-10">
              Three layers of trust — humanity, randomness, and identity — integrated into one protocol.
            </BodyText>
          </BlurFade>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {poweredBy.map(({ icon: Icon, name, tag, body }, index) => (
              <BlurFade key={name} blur="0px" delay={0.06 + index * 0.06} inView inViewMargin="-80px">
                <article
                  className="group flex h-full flex-col rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 transition-colors hover:border-black sm:p-7"
                >
                  <span className="font-mono text-[10px] font-bold tracking-widest text-[#9E9E9E] mb-3">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0] transition-colors group-hover:border-black">
                    <Icon className="h-[18px] w-[18px] text-black" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-[16px] font-semibold tracking-tight text-black mb-1 lg:text-[17px]">
                    {name}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#9E9E9E] mb-3">
                    {tag}
                  </p>
                  <p className="font-body text-[13px] leading-relaxed text-[#616161] lg:text-[14px]">
                    {body}
                  </p>
                </article>
              </BlurFade>
            ))}
          </div>

          <BlurFade blur="0px" delay={0.24} inView inViewMargin="-80px">
            <div className="mt-10 border-t border-[0.5px] border-[#E0E0E0] pt-5">
              <div className="flex flex-col items-center justify-center gap-3 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-4 sm:flex-row sm:gap-4">
                <span className="font-mono text-[10px] text-[#9E9E9E] uppercase tracking-[0.2em] shrink-0">
                  Also in the stack
                </span>
                <span className="hidden h-3 w-px bg-[#E0E0E0] sm:inline-block" aria-hidden />
                <p className="font-mono text-[11px] text-[#616161] tracking-wide text-center sm:text-left">
                  World Chain · Privy · USDC · ProveKit
                </p>
              </div>
            </div>
          </BlurFade>
        </SectionInner>
      </SectionShell>

      {/* Bottom Line */}
      <SectionShell dark>
        <HeroBackground variant="dark" />
        <SectionInner className="relative z-10">
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-[10px] border-[0.5px] border-[#2A2A2A] bg-black">
              <Blocks className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
            <SectionLabel dark>The bottom line</SectionLabel>
            <SectionTitle dark className="mb-5 max-w-[720px]">
              50/50, the way it was always supposed to work.
            </SectionTitle>
            <BodyText dark className="max-w-[640px] mb-4">
              WLD5050 is what a raffle looks like when you build it right: verified humans, fair
              randomness, automated payouts, and readable identities. No bots. No middlemen. No token.
            </BodyText>
            <BodyText dark className="max-w-[640px] mb-8">
              Just 50/50, the way it was always supposed to work.
            </BodyText>
            <div className="flex flex-wrap gap-3">
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
