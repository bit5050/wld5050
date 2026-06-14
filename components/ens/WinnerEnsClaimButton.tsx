'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { mainnet } from 'viem/chains'
import { getAddress, type Hex } from 'viem'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import { Button } from '@/components/ui/button'
import {
  getEnsDomainsUrl,
  getEnsRegistrarEtherscanUrl,
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
  winnerSubname: string
  ensMinted: boolean
  onClaimed?: () => void
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export default function WinnerEnsClaimButton({
  raffleId,
  winner,
  winnerSubname,
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

  if (ensMinted) return null

  const busy = isFetchingSig || isWritePending || isConfirming

  return (
    <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
        <Link
          href={getEnsDomainsUrl(winnerSubname)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[#616161] transition-colors hover:text-black"
        >
          Preview on ENS ↗
        </Link>
        {registrarAddress ? (
          <Link
            href={getEnsRegistrarEtherscanUrl(registrarAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[#616161] transition-colors hover:text-black"
          >
            Claim contract ↗
          </Link>
        ) : null}
        {txHash ? (
          <Link
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[#616161] transition-colors hover:text-black"
          >
            Claim tx ↗
          </Link>
        ) : null}
      </div>

      {!isConnected ? (
        <div className="rounded-[7px] border border-gray-100 bg-gray-50 px-3 py-3">
          <p className="mb-2 text-[11px] text-gray-600">
            Connect the wallet that won this raffle to claim your ENS badge on Ethereum.
          </p>
          <ConnectWalletButton />
        </div>
      ) : !isWinner ? (
        <p className="text-[11px] text-gray-500">
          Connected as {truncateAddress(address!)} — switch to the winner wallet{' '}
          <span className="font-mono text-black">{truncateAddress(winner)}</span> to claim.
        </p>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy || !registrarAddress}
          onClick={() => void claim()}
          className="h-9 rounded-[6px] border-black px-4 font-mono text-[10px] uppercase tracking-widest"
        >
          {busy ? 'Claiming…' : 'Claim badge on Ethereum'}
        </Button>
      )}
    </div>
  )
}
