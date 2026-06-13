'use client'

import { useCallback, useState } from 'react'
import {
  IDKitRequestWidget,
  orbLegacy,
  type IDKitResult,
  type RpContext,
} from '@worldcoin/idkit'
import { ScanFace } from 'lucide-react'
import { isValidWorldAppId, publicEnv } from '@/lib/env.public'
import { cn } from '@/lib/utils'

type Props = {
  action: string
  /** Wallet address used as the on-chain signal — must match msg.sender. */
  signal?: string
  onVerified: (result: IDKitResult) => void
  onError?: (message: string) => void
  disabled?: boolean
  className?: string
  label?: string
  verifiedLabel?: string
  verified?: boolean
}

async function fetchRpContext(action: string): Promise<RpContext> {
  const response = await fetch(`/api/worldid/rp-context?action=${encodeURIComponent(action)}`)
  const payload = (await response.json()) as RpContext & { error?: string }

  if (!response.ok) {
    throw new Error(payload.error ?? 'Failed to fetch World ID RP context')
  }

  return payload
}

export default function WorldIdVerifyButton({
  action,
  signal,
  onVerified,
  onError,
  disabled = false,
  className,
  label = 'Verify with World ID',
  verifiedLabel = 'World ID verified',
  verified = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const [rpContext, setRpContext] = useState<RpContext | null>(null)
  const [loading, setLoading] = useState(false)

  const appId = publicEnv.wldAppId
  const configured = isValidWorldAppId(appId)
  const canVerify = configured && Boolean(signal) && !disabled && !verified

  const handleOpen = useCallback(async () => {
    if (!canVerify) return

    setLoading(true)
    try {
      const context = await fetchRpContext(action)
      setRpContext(context)
      setOpen(true)
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'World ID verification failed to start')
    } finally {
      setLoading(false)
    }
  }, [action, canVerify, onError])

  if (!configured) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          'w-full rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] py-3.5 font-body text-[14px] font-medium text-[#9E9E9E] cursor-not-allowed',
          className,
        )}
      >
        Set NEXT_PUBLIC_WLD_APP_ID to enable World ID
      </button>
    )
  }

  if (verified) {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-2 rounded-[10px] border-[0.5px] border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3.5',
          className,
        )}
      >
        <span className="inline-flex h-2 w-2 rounded-full bg-green-500" aria-hidden />
        <span className="font-body text-[14px] font-medium text-black">{verifiedLabel}</span>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void handleOpen()}
        disabled={!canVerify || loading}
        className={cn(
          'inline-flex w-full items-center justify-center gap-2 rounded-[10px] border-[0.5px] border-black bg-white py-3.5 font-body text-[14px] font-medium text-black transition-colors hover:bg-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-40',
          className,
        )}
      >
        <ScanFace className="h-4 w-4" strokeWidth={1.5} />
        {loading ? 'Opening World ID…' : !signal ? 'Connect wallet first' : label}
      </button>

      {rpContext && signal ? (
        <IDKitRequestWidget
          open={open}
          onOpenChange={setOpen}
          app_id={appId}
          action={action}
          rp_context={rpContext}
          allow_legacy_proofs
          preset={orbLegacy({ signal })}
          onSuccess={(result) => {
            onVerified(result)
            setOpen(false)
          }}
          onError={(errorCode) => {
            onError?.(errorCode)
            setOpen(false)
          }}
        />
      ) : null}
    </>
  )
}
