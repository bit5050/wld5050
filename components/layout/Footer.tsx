export default function Footer() {
  const links = [
    { label: 'wld5050.eth', href: '#' },
    { label: 'agent.wld5050.eth', href: '#' },
    { label: 'bit5050.com', href: 'https://bit5050.com' },
    { label: 'Terms', href: '/terms' },
  ]

  return (
    <footer className="flex flex-col items-center gap-3 border-t border-gray-200 px-6 py-6 text-center xl:flex-row xl:items-center xl:justify-between xl:text-left">
      <span className="font-display text-xs font-medium text-gray-400">WLD5050</span>

      <div className="flex flex-col items-center gap-2 xl:items-end xl:gap-1">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 xl:justify-end">
          {links.map((l, i) => (
            <span key={l.label} className="flex items-center gap-2">
              {i > 0 && (
                <span className="hidden h-0.5 w-0.5 rounded-full bg-gray-300 sm:inline-block" />
              )}
              <a
                href={l.href}
                className="font-mono text-[11px] text-gray-400 transition-colors hover:text-black"
              >
                {l.label}
              </a>
            </span>
          ))}
        </div>

        <p className="text-[10px] leading-relaxed text-gray-400">
          Powered by World Chain · Chainlink CRE · ENS
        </p>

        <p className="max-w-sm text-[10px] leading-relaxed text-gray-400 xl:max-w-none">
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
