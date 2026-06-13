import type { Metadata } from 'next'
import Link from 'next/link'
import TermsContent from '@/components/legal/TermsContent'

export const metadata: Metadata = {
  title: 'Terms of Use & Privacy Policy | WLD5050',
  description:
    'Terms of Use, Privacy Policy, and Liability Waiver for WLD5050 by BIT5050 INC.',
}

export default function TermsPage() {
  return (
    <div className="px-6 py-10">
      <Link
        href="/"
        className="mb-6 inline-block font-body text-[12px] text-[#9E9E9E] transition-colors hover:text-black"
      >
        ← Back to home
      </Link>
      <TermsContent />
    </div>
  )
}
