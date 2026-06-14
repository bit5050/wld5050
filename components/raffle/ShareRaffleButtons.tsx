'use client'

import { useCallback, useMemo, useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import {
  buildShareMessage,
  getRaffleUrl,
  getTxTokenTransfersUrl,
  shareToFacebook,
  shareToTelegram,
  shareToWhatsApp,
  shareToX,
} from '@/lib/share/raffle-share'
import { cn } from '@/lib/utils'

type Props = {
  raffleId: number
  raffleName: string
  txHash?: string
  className?: string
  showTitle?: boolean
}

function ShareButton({
  label,
  href,
  onClick,
}: {
  label: string
  href?: string
  onClick?: () => void
}) {
  const sharedClass =
    'inline-flex items-center justify-center rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white px-3 py-2.5 font-body text-[12px] font-medium text-black transition-colors hover:border-black'

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={sharedClass}>
        {label}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={sharedClass}>
      {label}
    </button>
  )
}

export default function ShareRaffleButtons({
  raffleId,
  raffleName,
  txHash,
  className,
  showTitle = true,
}: Props) {
  const [copied, setCopied] = useState(false)
  const raffleUrl = useMemo(() => getRaffleUrl(raffleId), [raffleId])
  const shareMessage = useMemo(
    () => buildShareMessage(raffleName, raffleUrl),
    [raffleName, raffleUrl],
  )

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(raffleUrl)
      setCopied(true)
      toast.success('Raffle link copied')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }, [raffleUrl])

  const shareNative = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `WLD5050 — ${raffleName}`,
          text: shareMessage,
          url: raffleUrl,
        })
        return
      } catch {
        // user dismissed or share failed — fall through to copy
      }
    }

    await copyLink()
    toast.message('Paste the link in World App or any messenger')
  }, [copyLink, raffleName, raffleUrl, shareMessage])

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        {showTitle ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-2">
            Share this raffle
          </p>
        ) : null}
        <div className="flex items-center gap-2 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] px-3 py-2.5">
          <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-[#616161]">
            {raffleUrl}
          </span>
          <button
            type="button"
            onClick={() => void copyLink()}
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#E0E0E0] bg-white px-2 py-1 font-body text-[11px] text-black hover:border-black"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <ShareButton label="X" href={shareToX(shareMessage)} />
        <ShareButton label="Facebook" href={shareToFacebook(raffleUrl)} />
        <ShareButton label="WhatsApp" href={shareToWhatsApp(shareMessage)} />
        <ShareButton label="Telegram" href={shareToTelegram(raffleUrl, shareMessage)} />
        <ShareButton label="World App" onClick={() => void shareNative()} />
        <ShareButton label="Copy link" onClick={() => void copyLink()} />
      </div>

      {txHash ? (
        <a
          href={getTxTokenTransfersUrl(txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#616161] underline-offset-2 hover:text-black hover:underline"
        >
          View token transfers on Worldscan
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : null}
    </div>
  )
}
