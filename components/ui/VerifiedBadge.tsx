export default function VerifiedBadge({ label = 'World ID verified' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#1B5E20] bg-[#E8F5E9] px-2.5 py-1 rounded-full border-[0.5px] border-[#E0E0E0]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] inline-block shrink-0" />
      {label}
    </span>
  )
}
