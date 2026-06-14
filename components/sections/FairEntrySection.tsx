'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  Check,
  Fingerprint,
  ShieldCheck,
  Ticket,
  Wallet,
  X,
} from 'lucide-react'
import { BlurFade } from '@/components/ui/blur-fade'
import HeroBackground from '@/components/sections/hero-background'

const allowed = [
  { icon: Ticket, text: 'One ticket after World ID verification' },
  { icon: ShieldCheck, text: 'Enter unlimited different raffles' },
] as const

const denied = [
  { icon: X, text: 'Multiple tickets in the same raffle' },
  { icon: Wallet, text: 'Extra entries via additional wallets (same World ID)' },
] as const

export default function FairEntrySection() {
  return (
    <section
      id="fair-entry"
      className="relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px] border-[#2A2A2A] bg-black"
    >
      <HeroBackground variant="dark" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14 lg:items-start">
          <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
            <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-[10px] border-[0.5px] border-[#2A2A2A] bg-[#111111]">
              <Fingerprint className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#9E9E9E] mb-3">
              Fair entry
            </p>
            <h2 className="font-display text-[28px] font-semibold tracking-tight text-white mb-5 sm:text-[34px] lg:text-[36px]">
              One ticket per verified human
            </h2>
            <p className="font-body text-[14px] leading-relaxed text-[#9E9E9E] max-w-[560px] mb-6 lg:text-[15px]">
              Every WLD5050 raffle follows the same rule:{' '}
              <span className="text-white">one entry per real human, per round</span>. The app shows a
              single &ldquo;Buy ticket&rdquo; button — no quantity picker — because each verified World
              ID can only purchase one ticket in that raffle.
            </p>

            <div className="mb-8 flex flex-wrap gap-3">
              {[
                { icon: Fingerprint, label: 'World ID gated' },
                { icon: ShieldCheck, label: 'On-chain enforced' },
                { icon: Ticket, label: '1 ticket / raffle' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border-[0.5px] border-[#2A2A2A] bg-[#111111] px-3.5 py-2"
                >
                  <Icon className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#9E9E9E]">
                    {label}
                  </span>
                </span>
              ))}
            </div>

            <Link
              href="/about#one-entry"
              className="group inline-flex items-center gap-2 rounded-[10px] border-[0.5px] border-white bg-white px-5 py-3 font-body text-[14px] font-medium text-black transition-opacity hover:opacity-85"
            >
              Read the full fair entry policy
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </BlurFade>

          <BlurFade blur="0px" delay={0.1} inView inViewMargin="-80px">
            <aside
              className="rounded-[10px] border-[0.5px] border-[#2A2A2A] bg-white p-6 sm:p-7"
              aria-label="Entry rules per raffle"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]">
                  Per raffle
                </p>
                <span className="rounded-full border border-black px-2.5 py-0.5 font-mono text-[10px] text-black">
                  1:1
                </span>
              </div>

              <ul className="space-y-3 mb-5">
                {allowed.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
                      <Check className="h-3 w-3" strokeWidth={2} />
                    </span>
                    <span className="flex items-start gap-2 font-body text-[13px] leading-relaxed text-black">
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#616161]" strokeWidth={1.5} />
                      {text}
                    </span>
                  </li>
                ))}
                {denied.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#E0E0E0] text-[#9E9E9E]">
                      <X className="h-3 w-3" strokeWidth={2} />
                    </span>
                    <span className="flex items-start gap-2 font-body text-[13px] leading-relaxed text-[#616161]">
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9E9E9E]" strokeWidth={1.5} />
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="border-t border-[#E0E0E0] pt-4 font-mono text-[11px] leading-relaxed text-[#9E9E9E]">
                Enforced by World ID nullifiers in the WLD5050 smart contract on World Chain.
              </p>
            </aside>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
