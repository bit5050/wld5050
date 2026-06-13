import { Settlement } from '@/types'
import ENSName from '@/components/ens/ENSName'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import CREPanel from '@/components/chainlink/CREPanel'

interface Props { settlement: Settlement }

export default function WinnerCard({ settlement: s }: Props) {
  const initials = (s.winnerEns ?? s.winner).slice(0, 2).toUpperCase()

  return (
    <div className="space-y-3">
      <div className="border border-gray-200 rounded-[10px] overflow-hidden">
        <div className="px-4 py-3.5 bg-black flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Winner</span>
          <span className="font-mono text-[10px] text-white/40">Round #{s.raffleId}</span>
        </div>
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-mono text-[12px] font-bold shrink-0">
              {initials}
            </div>
            <div>
              <div className="font-display text-[16px] font-semibold tracking-tight">
                <ENSName address={s.winner} fallback={s.winnerEns ?? undefined} />
              </div>
              <VerifiedBadge />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Winner received', value: `$${s.winnerPrize.toFixed(2)}` },
              { label: 'Creator received', value: `$${s.creatorPayout.toFixed(2)}` },
              { label: 'Tickets sold', value: String(Math.round((s.winnerPrize * 2) / 2.5)) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-[7px] border border-gray-100 px-3 py-3">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{label}</div>
                <div className="font-mono text-[14px] font-bold">{value}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-3.5 py-2.5 border border-gray-100 rounded-[7px]">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Winner ENS subname</div>
              <div className="font-mono text-[11px] font-bold">{s.winnerSubname}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 12L12 2M12 2H6M12 2V8" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      <CREPanel steps={s.creSteps} />
    </div>
  )
}
