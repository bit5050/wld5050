'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ShareRaffleButtons from '@/components/raffle/ShareRaffleButtons'
import { cn } from '@/lib/utils'

type Props = {
  raffleId: number
  raffleName: string
  txHash?: string
  triggerLabel?: string
  triggerClassName?: string
  variant?: 'button' | 'icon'
}

export default function ShareRaffleDialog({
  raffleId,
  raffleName,
  txHash,
  triggerLabel = 'Share raffle',
  triggerClassName,
  variant = 'button',
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Share ${raffleName}`}
        className={cn(
          variant === 'icon'
            ? 'inline-flex items-center justify-center text-[#9E9E9E] transition-colors hover:text-black'
            : 'inline-flex w-full items-center justify-center gap-2 rounded-[7px] border-[0.5px] border-[#E0E0E0] bg-white py-2.5 font-body text-[13px] font-medium text-black transition-colors hover:border-black',
          triggerClassName,
        )}
      >
        {variant === 'icon' ? <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} /> : triggerLabel}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="border-[0.5px] border-[#E0E0E0] bg-white sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle className="font-display text-[18px] font-semibold tracking-tight text-black">
              Share this raffle
            </DialogTitle>
          </DialogHeader>
          <ShareRaffleButtons
            raffleId={raffleId}
            raffleName={raffleName}
            txHash={txHash}
            showTitle={false}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
