'use client'

import Link from 'next/link'
import { BlurFade } from '@/components/ui/blur-fade'
import RaffleCard from '@/components/raffle/RaffleCard'
import ContractAddressLink from '@/components/raffle/ContractAddressLink'
import type { Raffle } from '@/types'

type Props = {
  raffles: Raffle[]
}

export default function ActiveRafflesSection({ raffles }: Props) {
  return (
    <section
      id="raffles"
      className="relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px] border-[#E0E0E0] bg-white"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
        <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] text-[#9E9E9E] tracking-[0.2em] uppercase mb-2">
                Live now
              </p>
              <h2 className="font-display text-[28px] font-semibold tracking-tight sm:text-[32px]">
                Active raffles
              </h2>
              <p className="mt-2">
                <ContractAddressLink />
              </p>
            </div>
            <Link
              href="/buy-tickets"
              className="font-body text-[12px] text-[#9E9E9E] hover:text-black transition-colors sm:ml-auto sm:text-right shrink-0"
            >
              View all raffles →
            </Link>
          </div>
        </BlurFade>

        <BlurFade blur="0px" delay={0.08} inView inViewMargin="-80px">
          {raffles.length === 0 ? (
            <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] px-5 py-10 text-center">
              <p className="font-body text-[14px] text-[#616161]">
                No active raffles on-chain yet. Be the first to create one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {raffles.map((raffle) => (
                <RaffleCard key={raffle.id} raffle={raffle} compact />
              ))}
            </div>
          )}
        </BlurFade>

        <BlurFade blur="0px" delay={0.16} inView inViewMargin="-80px">
          <div className="mt-8 flex flex-col gap-4 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-[13px] text-[#616161]">
              Don&apos;t see one you like? Create your own in under 60 seconds.
            </p>
            <Link href="/create" className="shrink-0">
              <button
                type="button"
                className="font-body text-[13px] font-medium px-5 py-2.5 bg-white text-black rounded-[10px] border-[0.5px] border-[#E0E0E0] hover:border-black transition-colors whitespace-nowrap"
              >
                Create a raffle →
              </button>
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
