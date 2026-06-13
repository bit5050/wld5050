'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
      <Link href="/" className="font-display text-[17px] font-semibold tracking-tight">
        WLD<span className="text-gray-400">5050</span>
      </Link>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          World ID
        </span>
        <Link href="/create">
          <button className="text-[13px] font-medium px-4 py-2 bg-black text-white rounded-md hover:opacity-80 transition-opacity">
            + Create raffle
          </button>
        </Link>
      </div>
    </nav>
  )
}
