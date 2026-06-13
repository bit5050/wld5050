'use client'

import Link from 'next/link'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import {
  ExternalLink,
  RefreshCw,
  Target,
  Ticket,
  Trophy,
  Wallet,
} from 'lucide-react'
import { BlurFade } from '@/components/ui/blur-fade'
import HeroBackground from '@/components/sections/hero-background'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import ShareRaffleDialog from '@/components/raffle/ShareRaffleDialog'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { formatUSDC } from '@/lib/format'
import type { DashboardRaffleItem } from '@/lib/dashboard/types'
import { cn } from '@/lib/utils'

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function formatWld(amount: number) {
  return `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })} WLD`
}

function formatPool(amount: number, token: 'USDC' | 'WLD') {
  return token === 'USDC' ? formatUSDC(amount) : formatWld(amount)
}

function SectionShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        'relative left-1/2 w-screen max-w-[1400px] -translate-x-1/2 border-b border-[0.5px] border-[#E0E0E0] bg-white',
        className,
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

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: typeof Trophy
  label: string
  value: string
  subValue?: string
}) {
  return (
    <article className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-5 sm:p-6">
      <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0]">
        <Icon className="h-4 w-4 text-black" strokeWidth={1.5} />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-2">{label}</p>
      <p className="font-mono text-[22px] font-bold tracking-tight text-black sm:text-[24px]">{value}</p>
      {subValue && (
        <p className="font-mono text-[12px] text-[#616161] mt-1">{subValue}</p>
      )}
    </article>
  )
}

function RaffleList({
  title,
  items,
  emptyMessage,
}: {
  title: string
  items: DashboardRaffleItem[]
  emptyMessage: string
}) {
  return (
    <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 sm:p-7">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-2">{title}</p>
      {items.length === 0 ? (
        <p className="font-body text-[13px] text-[#616161]">{emptyMessage}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={`${title}-${item.id}`}
              className="flex items-start justify-between gap-4 border-b border-[0.5px] border-[#E0E0E0] pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <Link
                  href={`/raffle/${item.id}`}
                  className="font-display text-[15px] font-semibold text-black hover:opacity-70 transition-opacity"
                >
                  Raffle #{item.id}: {item.name}
                </Link>
                <p className="font-body text-[12px] text-[#616161] mt-1">
                  {item.role} · {item.status} ·{' '}
                  {item.role === 'Creator'
                    ? `Tickets sold: ${item.ticketsSold}`
                    : `Tickets: ${item.ticketsHeld}`}
                  {item.token === 'USDC' ? ' · USDC' : ' · WLD'}
                </p>
                {item.winnerPrize != null && (
                  <p className="font-mono text-[11px] text-black mt-1">
                    Won {formatPool(item.winnerPrize, item.token)}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-mono text-[11px] text-[#616161]">
                  {formatPool(item.poolAmount, item.token)} pool
                </span>
                <ShareRaffleDialog
                  raffleId={item.id}
                  raffleName={item.name}
                  variant="icon"
                />
                <Link
                  href={`/raffle/${item.id}`}
                  className="text-[#9E9E9E] hover:text-black transition-colors"
                  aria-label={`View raffle ${item.id}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function DashboardContent() {
  const { ready, authenticated, logout } = usePrivy()
  const { wallets } = useWallets()
  const address = wallets[0]?.address as `0x${string}` | undefined

  const { data, isLoading, error, refresh, hasContract } = useDashboardData(address)

  const showConnect = ready && !authenticated

  return (
    <>
      <SectionShell>
        <HeroBackground />
        <SectionInner className="relative z-10 py-16 lg:py-20">
          <BlurFade blur="0px" delay={0} inView>
            <p className="font-mono text-[11px] text-[#9E9E9E] tracking-[0.2em] uppercase mb-3">
              Dashboard
            </p>
            <h1 className="font-display text-[40px] font-bold leading-[1.12] tracking-tight mb-5 sm:text-[44px] lg:text-[48px]">
              Your WLD5050 Raffle Statistics
            </h1>
            {address ? (
              <p className="font-mono text-[12px] text-[#616161] mb-6">
                Connected: {address}
              </p>
            ) : (
              <p className="font-body text-[14px] text-[#616161] mb-6 max-w-[560px]">
                Connect your wallet to view raffles created, tickets played, and USDC/WLD winnings on
                World Chain.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {address && (
                <span className="inline-flex items-center gap-3 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-4 py-2.5 font-mono text-[12px] text-black">
                  <span>{truncateAddress(address)}</span>
                  <span className="text-[#9E9E9E]">|</span>
                  <span>{data.balances.eth.toFixed(4)} ETH</span>
                  <span className="text-[#9E9E9E]">|</span>
                  <span>{formatUSDC(data.balances.usdc)} USDC</span>
                  <span className="text-[#9E9E9E]">|</span>
                  <span>{formatWld(data.balances.wld)}</span>
                </span>
              )}
              <ConnectWalletButton />
              {authenticated && (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="font-body text-[13px] font-medium px-4 py-2 bg-white text-black rounded-[10px] border-[0.5px] border-[#E0E0E0] hover:border-black transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          </BlurFade>
        </SectionInner>
      </SectionShell>

      {showConnect ? (
        <SectionShell>
          <SectionInner>
            <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-8 text-center">
              <p className="font-body text-[14px] text-[#616161] mb-4">
                Connect your wallet to load on-chain raffle history from World Chain.
              </p>
              <ConnectWalletButton />
            </div>
          </SectionInner>
        </SectionShell>
      ) : (
        <>
          <SectionShell>
            <SectionInner>
              <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
                <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-2">
                        Rafflenomics
                      </p>
                      <h2 className="font-display text-[24px] font-semibold tracking-tight text-black sm:text-[28px]">
                        Wallet Performance
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => refresh()}
                      disabled={isLoading || !address}
                      className="inline-flex items-center gap-2 font-body text-[13px] font-medium px-4 py-2.5 bg-black text-white rounded-[10px] hover:opacity-80 transition-opacity disabled:opacity-40"
                    >
                      <RefreshCw
                        className={cn('h-4 w-4', isLoading && 'animate-spin')}
                        strokeWidth={1.5}
                      />
                      Refresh
                    </button>
                  </div>

                  {!hasContract && (
                    <p className="font-body text-[13px] text-[#616161] mb-6 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3">
                      Contract address not configured. Set{' '}
                      <span className="font-mono text-[12px]">NEXT_PUBLIC_WLD5050_CONTRACT</span> to
                      load live stats.
                    </p>
                  )}

                  {error && (
                    <p className="font-body text-[13px] text-[#616161] mb-6">{error}</p>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <StatCard
                      icon={Trophy}
                      label="USDC won"
                      value={formatUSDC(data.stats.usdcWon)}
                    />
                    <StatCard
                      icon={Trophy}
                      label="WLD won"
                      value={formatWld(data.stats.wldWon)}
                    />
                    <StatCard
                      icon={Ticket}
                      label="Raffles created"
                      value={String(data.stats.rafflesCreated)}
                    />
                    <StatCard
                      icon={Target}
                      label="Raffles won"
                      value={String(data.stats.rafflesWon)}
                    />
                    <StatCard
                      icon={Wallet}
                      label="Win rate"
                      value={`${data.stats.winRate.toFixed(1)}%`}
                      subValue={`${data.stats.rafflesPlayed} played`}
                    />
                  </div>
                </div>
              </BlurFade>
            </SectionInner>
          </SectionShell>

          <SectionShell>
            <SectionInner>
              <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
                <BlurFade blur="0px" delay={0.06} inView inViewMargin="-80px">
                  <RaffleList
                    title="Raffles created"
                    items={data.created}
                    emptyMessage="No created raffles found for this wallet."
                  />
                </BlurFade>
                <BlurFade blur="0px" delay={0.1} inView inViewMargin="-80px">
                  <RaffleList
                    title="Raffles won"
                    items={data.won}
                    emptyMessage="No raffle wins yet for this wallet."
                  />
                </BlurFade>
              </div>
            </SectionInner>
          </SectionShell>

          <SectionShell>
            <SectionInner>
              <BlurFade blur="0px" delay={0} inView inViewMargin="-80px">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-2">
                  Participation
                </p>
                <h2 className="font-display text-[24px] font-semibold tracking-tight text-black mb-6 sm:text-[28px]">
                  Raffles played
                </h2>
                <RaffleList
                  title="All entries"
                  items={data.played}
                  emptyMessage="No raffle entries found for this wallet."
                />
              </BlurFade>
            </SectionInner>
          </SectionShell>
        </>
      )}
    </>
  )
}
