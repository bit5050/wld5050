'use client'

import Marquee from 'react-fast-marquee'

type Props = {
  items: string[]
  className?: string
  speed?: number
}

/** Infinite ticker — live stats, chains, sponsors. */
export function StatsMarquee({ items, className = '', speed = 40 }: Props) {
  return (
    <div className={`border-y border-border bg-muted/20 py-2 ${className}`}>
      <Marquee speed={speed} gradient={false} pauseOnHover>
        {items.map((item) => (
          <span
            key={item}
            className="mx-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  )
}
