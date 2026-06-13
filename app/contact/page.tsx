export default function ContactPage() {
  return (
    <div className="px-6 py-10 max-w-[520px]">
      <h1 className="font-display text-[28px] font-semibold tracking-tight mb-1">Contact</h1>
      <p className="text-[13px] text-gray-600 mb-8">
        Questions about WLD5050, partnerships, or support — reach us on ENS.
      </p>
      <div className="space-y-4">
        {[
          { label: 'Primary', value: 'wld5050.eth' },
          { label: 'Agent', value: 'agent.wld5050.eth' },
          { label: 'Builder', value: 'bit5050.com' },
        ].map(({ label, value }) => (
          <div
            key={value}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
          >
            <span className="text-[12px] text-gray-600">{label}</span>
            <span className="font-mono text-[12px] font-bold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
