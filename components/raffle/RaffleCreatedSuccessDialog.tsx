'use client'

import Link from 'next/link'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ShareRaffleButtons from '@/components/raffle/ShareRaffleButtons'
import { getTxExplorerUrl } from '@/lib/share/raffle-share'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  raffleId: number
  raffleName: string
  txHash: `0x${string}`
}

export default function RaffleCreatedSuccessDialog({
  open,
  onOpenChange,
  raffleId,
  raffleName,
  txHash,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[0.5px] border-[#E0E0E0] bg-white sm:max-w-md" showCloseButton>
        <DialogHeader className="items-center text-center sm:items-center sm:text-center">
          <VerifiedBadge label="Raffle created on World Chain" />
          <DialogTitle className="font-display text-[22px] font-semibold tracking-tight text-black">
            Raffle created successfully
          </DialogTitle>
          <DialogDescription className="font-body text-[13px] text-[#616161]">
            <span className="font-medium text-black">{raffleName}</span> is live. Share the link so
            verified humans can buy tickets.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] p-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-1">
              Raffle #{raffleId}
            </p>
            <Link
              href={`/raffle/${raffleId}`}
              className="font-body text-[14px] font-medium text-black underline-offset-2 hover:underline"
            >
              Open raffle page
            </Link>
          </div>

          <ShareRaffleButtons raffleId={raffleId} raffleName={raffleName} txHash={txHash} />

          <div className="rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-white p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-1">
              On-chain proof
            </p>
            <a
              href={getTxExplorerUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-[#616161] break-all underline-offset-2 hover:text-black hover:underline"
            >
              {txHash}
            </a>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/raffle/${raffleId}`}
              className="flex-1 rounded-[10px] bg-black py-3 text-center font-body text-[13px] font-medium text-white transition-opacity hover:opacity-80"
            >
              View raffle
            </Link>
            <Link
              href="/"
              className="flex-1 rounded-[10px] border-[0.5px] border-[#E0E0E0] py-3 text-center font-body text-[13px] font-medium text-black transition-colors hover:border-black"
            >
              Browse all raffles
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
