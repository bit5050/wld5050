export default function DividerLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="font-mono text-[9px] text-gray-400 tracking-widest uppercase whitespace-nowrap">{text}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}
