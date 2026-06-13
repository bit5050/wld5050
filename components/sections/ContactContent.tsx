'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AtSign, Building2, ExternalLink, Globe, Mail } from 'lucide-react'
import { BlurFade } from '@/components/ui/blur-fade'
import { StatsMarquee } from '@/components/effects/stats-marquee'
import HeroBackground from '@/components/sections/hero-background'
import { cn } from '@/lib/utils'

const contactMarquee = [
  'BIT5050 INC.',
  'Delaware C-Corp',
  'wld5050.eth',
  'agent.wld5050.eth',
  'bit5050.com',
  'World Chain',
  'All Product. All Service. No Token.',
] as const

const ensContacts = [
  {
    label: 'Platform',
    value: 'wld5050.eth',
    href: 'https://app.ens.domains/wld5050.eth',
    description: 'Primary ENS identity and platform wallet',
  },
  {
    label: 'CRE agent',
    value: 'agent.wld5050.eth',
    href: 'https://app.ens.domains/agent.wld5050.eth',
    description: 'Chainlink CRE draw agent on World Chain',
  },
  {
    label: 'Parent company',
    value: 'bit5050.com',
    href: 'https://bit5050.com',
    description: 'BIT5050 multi-chain raffle protocol',
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

function ContactLinkCard({
  icon: Icon,
  label,
  value,
  href,
  description,
  external = true,
}: {
  icon: typeof Mail
  label: string
  value: string
  href: string
  description?: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group flex flex-col rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 transition-colors hover:border-black sm:p-7"
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0] transition-colors group-hover:border-black">
        <Icon className="h-[18px] w-[18px] text-black" strokeWidth={1.5} />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-2">{label}</p>
      <p className="font-mono text-[15px] font-bold text-black mb-2 flex items-center gap-2">
        {value}
        {external && (
          <ExternalLink
            className="h-3.5 w-3.5 text-[#9E9E9E] transition-colors group-hover:text-black"
            strokeWidth={1.5}
          />
        )}
      </p>
      {description && (
        <p className="font-body text-[13px] leading-relaxed text-[#616161]">{description}</p>
      )}
    </a>
  )
}

export default function ContactContent() {
  return (
    <>
      {/* Hero */}
      <SectionShell>
        <HeroBackground />
        <SectionInner className="relative z-10 py-16 lg:py-20">
          <BlurFade blur="0px" delay={0} inView>
            <SectionLabel>Contact</SectionLabel>
            <h1 className="font-display text-[40px] font-bold leading-[1.12] tracking-tight mb-5 sm:text-[44px] lg:text-[48px]">
              Get in touch
            </h1>
            <BodyText className="max-w-[640px]">
              Questions about WLD5050, partnerships, integrations, or support reach BIT5050 INC.
              directly. We build human-verified raffle infrastructure on World Chain.
            </BodyText>
            <p className="mt-4 max-w-[640px] font-body text-[14px] font-semibold italic leading-relaxed text-black lg:text-[15px]">
              BIT5050 INC. is Now Raising Its Next Round of Funding
            </p>
          </BlurFade>
        </SectionInner>
      </SectionShell>

      {/* Brands */}
      <SectionShell id="brands">
        <StatsMarquee items={[...contactMarquee]} className="border-[#E0E0E0] bg-[#FAFAFA]" />
        <SectionInner>
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <SectionLabel>Ecosystem</SectionLabel>
            <SectionTitle className="mb-3">WLD5050 × BIT5050</SectionTitle>
            <BodyText className="max-w-[640px] mb-10">
              WLD5050 is the World Chain deployment of BIT5050 — the world&apos;s leading multi-chain
              Web3 50/50 raffle protocol. Same team, same philosophy, built for verified humans.
            </BodyText>
          </BlurFade>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-8 lg:items-stretch">
            <BlurFade blur="0px" delay={0.06} inView inViewMargin="-80px" className="h-full">
              <article
                className="flex h-full flex-col rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 sm:p-8"
              >
                <div className="mb-6 flex h-[148px] items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] px-8">
                  <Image
                    src="/images/WLD5050.jpg"
                    alt="WLD5050 logo"
                    width={320}
                    height={120}
                    className="h-[72px] w-auto max-w-full object-contain"
                    priority
                  />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-2">
                  World Chain product
                </p>
                <h3 className="font-display text-[20px] font-semibold tracking-tight text-black mb-3">
                  WLD5050
                </h3>
                <BodyText className="grow">
                  Human-verified 50/50 raffles on World Chain. World ID, Chainlink CRE, and ENS
                  fully automated, no bots, no claiming step.
                </BodyText>
              </article>
            </BlurFade>

            <BlurFade blur="0px" delay={0.12} inView inViewMargin="-80px" className="h-full">
              <article
                className="flex h-full flex-col rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 sm:p-8"
              >
                <div className="mb-6 flex h-[148px] items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] px-8">
                  <Image
                    src="/images/BIT5050.jpg"
                    alt="BIT5050 logo"
                    width={320}
                    height={120}
                    className="h-[72px] w-auto max-w-full object-contain"
                  />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-2">
                  Parent company
                </p>
                <h3 className="font-display text-[20px] font-semibold tracking-tight text-black mb-3">
                  BIT5050 INC.
                </h3>
                <BodyText className="grow">
                  Delaware C-Corp building Web3 raffle platforms across 17+ blockchain ecosystems.
                  All Product. All Service. No Token.
                </BodyText>
              </article>
            </BlurFade>
          </div>
        </SectionInner>
      </SectionShell>

      {/* Direct contact */}
      <SectionShell id="contact-info">
        <SectionInner>
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <SectionLabel>Reach us</SectionLabel>
            <SectionTitle className="mb-3">Contact information</SectionTitle>
            <BodyText className="max-w-[640px] mb-10">
              For partnerships, press, integrations, or general inquiries — use email or follow us on
              X. On-chain identities are listed below.
            </BodyText>
          </BlurFade>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            <BlurFade blur="0px" delay={0.06} inView inViewMargin="-80px">
              <ContactLinkCard
                icon={Building2}
                label="Company"
                value="BIT5050 INC."
                href="https://bit5050.com"
                description="Delaware C-Corp · multi-chain Web3 50/50 raffle protocol"
              />
            </BlurFade>
            <BlurFade blur="0px" delay={0.1} inView inViewMargin="-80px">
              <ContactLinkCard
                icon={Mail}
                label="Email"
                value="info@bit5050.com"
                href="mailto:info@bit5050.com"
                description="Partnerships, support, and general inquiries"
                external={false}
              />
            </BlurFade>
            <BlurFade blur="0px" delay={0.14} inView inViewMargin="-80px">
              <ContactLinkCard
                icon={Globe}
                label="X (Twitter)"
                value="@Bit5050official"
                href="https://x.com/Bit5050official"
                description="Updates from the BIT5050 team"
              />
            </BlurFade>
          </div>
        </SectionInner>
      </SectionShell>

      {/* ENS */}
      <SectionShell>
        <SectionInner>
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <SectionLabel>On-chain</SectionLabel>
            <SectionTitle className="mb-3">ENS &amp; web</SectionTitle>
            <BodyText className="max-w-[640px] mb-10">
              Every key actor in the WLD5050 stack has a human-readable identity — no raw hex in the
              UI.
            </BodyText>
          </BlurFade>

          <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
            {ensContacts.map(({ label, value, href, description }, index) => (
              <BlurFade
                key={value}
                blur="0px"
                delay={0.06 + index * 0.04}
                inView
                inViewMargin="-80px"
              >
                <ContactLinkCard
                  icon={AtSign}
                  label={label}
                  value={value}
                  href={href}
                  description={description}
                />
              </BlurFade>
            ))}
          </div>
        </SectionInner>
      </SectionShell>

      {/* CTA */}
      <SectionShell dark>
        <HeroBackground variant="dark" />
        <SectionInner className="relative z-10">
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <SectionLabel dark>Next step</SectionLabel>
            <SectionTitle dark className="mb-5 max-w-[720px]">
              Ready to launch a raffle?
            </SectionTitle>
            <BodyText dark className="max-w-[640px] mb-8">
              Create a human-verified 50/50 raffle on World Chain — or browse active rounds and buy a
              ticket with World ID.
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
              <Link href="/how-it-works">
                <button
                  type="button"
                  className="font-body text-[14px] font-medium px-6 py-3 bg-black text-white rounded-[10px] border-[0.5px] border-[#2A2A2A] hover:border-white transition-colors"
                >
                  How it works
                </button>
              </Link>
            </div>
          </BlurFade>
        </SectionInner>
      </SectionShell>
    </>
  )
}
