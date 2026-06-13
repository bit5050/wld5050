export default function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[22px] font-bold tracking-tight">{value}</span>
      <span className="text-[11px] text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  )
}
