'use client'

import Link from 'next/link'
import { BlurFade } from '@/components/ui/blur-fade'
import CompletedRaffleCard from '@/components/raffle/CompletedRaffleCard'
import type { CompletedRaffle } from '@/types'

type Props = {
  raffles: CompletedRaffle[]
}

export default function CompletedRafflesSection({ raffles }: Props) {
  return (
    <section className="relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px] border-[#E0E0E0] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
        <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] text-[#9E9E9E] tracking-[0.2em] uppercase mb-2">
                Settled onchain
              </p>
              <h2 className="font-display text-[28px] font-semibold tracking-tight sm:text-[32px]">
                Completed Raffle Results
              </h2>
            </div>
            <Link
              href="/results"
              className="font-body text-[12px] text-[#9E9E9E] hover:text-black transition-colors sm:ml-auto sm:text-right shrink-0"
            >
              View all results →
            </Link>
          </div>
        </BlurFade>

        <BlurFade blur="0px" delay={0.08} inView inViewMargin="-80px">
          {raffles.length === 0 ? (
            <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] px-5 py-10 text-center">
              <p className="font-body text-[14px] text-[#616161]">
                No settled raffles yet. Results appear here after Chainlink CRE completes a draw.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {raffles.map((raffle) => (
                <CompletedRaffleCard key={raffle.raffleId} raffle={raffle} compact />
              ))}
            </div>
          )}
        </BlurFade>
      </div>
    </section>
  )
}
