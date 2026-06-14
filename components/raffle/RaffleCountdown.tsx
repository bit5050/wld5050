'use client'

type Props = {
  phase: 'upcoming' | 'live' | 'ended'
  startsIn: string
  endsIn: string
  settled?: boolean
  paymentToken?: 'USDC' | 'WLD'
}

function TimerCell({
  label,
  value,
  active,
  muted,
}: {
  label: string
  value: string
  active?: boolean
  muted?: boolean
}) {
  return (
    <div
      className={[
        'rounded-[10px] border-[0.5px] px-4 py-3',
        active
          ? 'border-black bg-black text-white'
          : 'border-[#E0E0E0] bg-[#FAFAFA] text-black',
        muted ? 'opacity-60' : '',
      ].join(' ')}
    >
      <p
        className={[
          'mb-1 font-mono text-[10px] uppercase tracking-[0.2em]',
          active ? 'text-[#9E9E9E]' : 'text-[#9E9E9E]',
        ].join(' ')}
      >
        {label}
      </p>
      <p className="font-mono text-[20px] font-bold tracking-tight sm:text-[22px]">{value}</p>
    </div>
  )
}

export default function RaffleCountdown({
  phase,
  startsIn,
  endsIn,
  settled = false,
  paymentToken = 'USDC',
}: Props) {
  if (phase === 'ended' && settled) {
    return (
      <div className="mb-8 rounded-[10px] border-[0.5px] border-black bg-black px-4 py-4 text-white">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Raffle settled</p>
        <p className="mt-1 font-mono text-[18px] font-bold">Winner paid in {paymentToken}</p>
        <p className="mt-2 text-[12px] text-white/70">
          Chainlink CRE completed the draw and payouts. See full results below.
        </p>
      </div>
    )
  }

  if (phase === 'ended') {
    return (
      <div className="mb-8 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] px-4 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9E9E9E]">Raffle ended</p>
        <p className="mt-1 font-mono text-[18px] font-bold text-black">Waiting for CRE settlement</p>
        <p className="mt-2 text-[12px] leading-relaxed text-[#616161]">
          Ticket sales are closed. Chainlink CRE will draw a verifiable random winner and pay out{' '}
          {paymentToken} automatically — usually within a minute of the deadline.
        </p>
      </div>
    )
  }

  if (phase === 'upcoming') {
    return (
      <div className="mb-8 space-y-3">
        <TimerCell label="Starts in" value={startsIn} active />
        <TimerCell label="Ends in" value={endsIn} muted />
      </div>
    )
  }

  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-2">
      <TimerCell label="Started" value="Live now" />
      <TimerCell label="Ends in" value={endsIn} active />
    </div>
  )
}
