'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import TermsContent from '@/components/legal/TermsContent'
import { acceptTerms, hasAcceptedTerms } from '@/lib/legal/terms-storage'

function TermsLinkButton({ onClick, bold = false }: { onClick: () => void; bold?: boolean }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClick()
      }}
      className={`text-black underline underline-offset-2 hover:opacity-70 ${bold ? 'font-semibold' : 'font-medium'}`}
    >
      Terms of Service &amp; Privacy Policy
    </button>
  )
}

export default function TermsAgreementModal() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [showTermsViewer, setShowTermsViewer] = useState(false)
  const [checked, setChecked] = useState(false)
  const [mounted, setMounted] = useState(false)

  const isTermsPage = pathname === '/terms'

  useEffect(() => {
    setMounted(true)
    if (isTermsPage || hasAcceptedTerms()) {
      setOpen(false)
      return
    }
    setOpen(true)
  }, [isTermsPage])

  useEffect(() => {
    if (!open && !showTermsViewer) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open, showTermsViewer])

  const handleAgree = () => {
    if (!checked) return
    acceptTerms()
    setOpen(false)
    setShowTermsViewer(false)
  }

  if (!mounted || !open || isTermsPage) return null

  return (
    <>
      <div
        className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-agreement-title"
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />

        <div className="relative z-10 w-full max-w-[640px] rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-6 py-8 sm:px-10 sm:py-10">
          <h2
            id="terms-agreement-title"
            className="font-display text-[28px] font-bold leading-[1.15] tracking-tight text-black sm:text-[34px] lg:text-[38px] mb-6"
          >
            Terms of Service
            <br />
            Agreement &amp;
            <br />
            Privacy Policy
          </h2>

          <p className="font-body text-[14px] leading-relaxed text-[#616161] mb-8 max-w-[520px]">
            Welcome to WLD5050 by BIT5050 INC. Before using our platform, please read and agree to
            our <TermsLinkButton onClick={() => setShowTermsViewer(true)} />.
          </p>

          <label className="mb-8 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#E0E0E0] accent-black"
            />
            <span className="font-body text-[14px] leading-relaxed text-[#616161]">
              I have read and agree to the{' '}
              <TermsLinkButton bold onClick={() => setShowTermsViewer(true)} />
            </span>
          </label>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!checked}
              onClick={handleAgree}
              className="font-body text-[14px] font-medium px-6 py-2.5 rounded-[10px] border-[0.5px] transition-colors disabled:cursor-not-allowed disabled:border-[#E0E0E0] disabled:bg-[#F0F0F0] disabled:text-[#9E9E9E] enabled:border-black enabled:bg-black enabled:text-white enabled:hover:opacity-80"
            >
              I Agree
            </button>
          </div>
        </div>
      </div>

      {showTermsViewer ? (
        <div
          className="fixed inset-0 z-210 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-viewer-title"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            aria-hidden
            onClick={() => setShowTermsViewer(false)}
          />

          <div className="relative z-10 flex h-[min(90vh,820px)] w-full max-w-[800px] flex-col overflow-hidden rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white">
            <div className="flex items-center justify-between border-b border-[0.5px] border-[#E0E0E0] px-5 py-4 sm:px-6">
              <h3
                id="terms-viewer-title"
                className="font-display text-[18px] font-semibold tracking-tight text-black sm:text-[20px]"
              >
                Terms of Service &amp; Privacy Policy
              </h3>
              <button
                type="button"
                onClick={() => setShowTermsViewer(false)}
                className="font-body text-[13px] font-medium text-[#616161] transition-colors hover:text-black"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              <TermsContent />
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[0.5px] border-[#E0E0E0] px-5 py-4 sm:px-6">
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[12px] text-[#9E9E9E] underline underline-offset-2 transition-colors hover:text-black"
              >
                Open full page
              </Link>
              <button
                type="button"
                onClick={() => setShowTermsViewer(false)}
                className="font-body text-[14px] font-medium px-5 py-2.5 rounded-[10px] border-[0.5px] border-black bg-black text-white transition-opacity hover:opacity-80"
              >
                Back to agreement
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
