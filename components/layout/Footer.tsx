export default function Footer() {
  const links = ['wld5050.eth', 'agent.wld5050.eth', 'bit5050.com']
  return (
    <footer className="px-6 py-6 flex items-center justify-between border-t border-gray-200">
      <span className="font-display text-xs text-gray-400 font-medium">WLD5050</span>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          {links.map((l, i) => (
            <span key={l} className="flex items-center gap-2">
              {i > 0 && <span className="w-0.5 h-0.5 rounded-full bg-gray-300 inline-block" />}
              <a href="#" className="text-[11px] text-gray-400 hover:text-black transition-colors font-mono">{l}</a>
            </span>
          ))}
        </div>
        <p className="text-[10px] text-gray-400">Powered by World Chain · Chainlink CRE · ENS</p>
      </div>
    </footer>
  )
}
