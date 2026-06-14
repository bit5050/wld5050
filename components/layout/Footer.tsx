export default function Footer() {
  const links = [
    { label: 'wld5050.eth', href: '#' },
    { label: 'agent.wld5050.eth', href: '#' },
    { label: 'bit5050.com', href: 'https://bit5050.com' },
    { label: 'Terms', href: '/terms' },
  ]
  return (
    <footer className="px-6 py-6 flex items-center justify-between border-t border-gray-200">
      <span className="font-display text-xs text-gray-400 font-medium">WLD5050</span>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          {links.map((l, i) => (
            <span key={l.label} className="flex items-center gap-2">
              {i > 0 && <span className="w-0.5 h-0.5 rounded-full bg-gray-300 inline-block" />}
              <a href={l.href} className="text-[11px] text-gray-400 hover:text-black transition-colors font-mono">{l.label}</a>
            </span>
          ))}
        </div>
        <p className="text-[10px] text-gray-400">Powered by World Chain · Chainlink CRE · ENS</p>
        <p className="text-[10px] text-gray-400">
          © 2026{' '}
          <a
            href="https://www.bit5050.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            BIT5050 INC.
          </a>{' '}
          All rights reserved. Built for the Web3 community.
        </p>
      </div>
    </footer>
  )
}
