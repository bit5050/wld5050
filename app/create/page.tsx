'use client'

import Link from 'next/link'
import CreateRaffleForm from '@/components/raffle/CreateRaffleForm'

export default function CreatePage() {
  return (
    <div className="px-6 py-10">
      <Link
        href="/"
        className="mb-6 inline-block font-body text-[12px] text-[#9E9E9E] transition-colors hover:text-black"
      >
        ← Back to home
      </Link>
      <CreateRaffleForm variant="page" />
    </div>
  )
}
