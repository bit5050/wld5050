export default function VerifiedBadge({ label = 'World ID verified' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-800 bg-green-50 px-2 py-0.5 rounded-full">
      <span className="w-1 h-1 rounded-full bg-green-500 inline-block" />
      {label}
    </span>
  )
}
