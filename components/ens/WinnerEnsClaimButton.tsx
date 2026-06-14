'use client'

import { useCallback, useState } from 'react'
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { mainnet } from 'viem/chains'
import { getAddress, type Hex } from 'viem'
import { Button } from '@/components/ui/button'
import {
  getWinnerEnsClaimRegistrarAddress,
  winnerEnsClaimRegistrarAbi,
} from '@/lib/ens-claim/constants'
import { toastError, toastSuccess } from '@/lib/toast'

type SignaturePayload = {
  raffleId: number
  label: string
  deadline: number
  signature: Hex
  registrarAddress: `0x${string}`
}

type Props = {
  raffleId: number
  winner: `0x${string}`
  ensMinted: boolean
  onClaimed?: () => void
}

export default function WinnerEnsClaimButton({
  raffleId,
  winner,
  ensMinted,
  onClaimed,
}: Props) {
  const registrarAddress = getWinnerEnsClaimRegistrarAddress()
  const { address, isConnected, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync, isPending: isWritePending } = useWriteContract()
  const [txHash, setTxHash] = useState<Hex | undefined>()
  const [isFetchingSig, setIsFetchingSig] = useState(false)

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: mainnet.id,
  })

  const isWinner =
    isConnected &&
    address != null &&
    getAddress(address) === getAddress(winner)

  const claim = useCallback(async () => {
    if (!registrarAddress || !address) return

    setIsFetchingSig(true)
    try {
      if (chainId !== mainnet.id) {
        await switchChainAsync({ chainId: mainnet.id })
      }

      const res = await fetch('/api/ens-claim/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raffleId, winner: address }),
      })

      const data = (await res.json()) as SignaturePayload & { error?: string }
      if (!res.ok) {
        throw new Error(data.error ?? 'Could not get claim signature')
      }

      const hash = await writeContractAsync({
        chainId: mainnet.id,
        address: data.registrarAddress,
        abi: winnerEnsClaimRegistrarAbi,
        functionName: 'claim',
        args: [
          BigInt(data.raffleId),
          data.label,
          BigInt(data.deadline),
          data.signature,
        ],
      })

      setTxHash(hash)
      toastSuccess('Winner ENS badge claim submitted on Ethereum')
      onClaimed?.()
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Claim failed')
    } finally {
      setIsFetchingSig(false)
    }
  }, [
    address,
    chainId,
    onClaimed,
    raffleId,
    registrarAddress,
    switchChainAsync,
    writeContractAsync,
  ])

  if (ensMinted || !registrarAddress) return null
  if (!isWinner) return null

  const busy = isFetchingSig || isWritePending || isConfirming

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={busy}
      onClick={() => void claim()}
      className="mt-2 h-8 rounded-[6px] border-black px-3 font-mono text-[10px] uppercase tracking-widest"
    >
      {busy ? 'Claiming…' : 'Claim badge on Ethereum'}
    </Button>
  )
}
