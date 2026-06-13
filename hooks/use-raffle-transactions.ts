'use client'

import { useCallback, useState } from 'react'
import type { IDKitResult } from '@worldcoin/idkit'
import { useWallets } from '@privy-io/react-auth'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'sonner'
import {
  PAYMENT_TOKEN_USDC,
  PLATFORM_FEE_USDC_RAW,
  TICKET_PRICE_USDC_RAW,
  USDC_ADDRESS,
  wld5050WriteAbi,
} from '@/lib/contracts/wld5050'
import { computeRaffleDurationSeconds, getContractAddress } from '@/lib/contracts/raffle-tx'
import { erc20Abi } from '@/lib/contracts/wld5050'
import { extractLegacyOrbProof } from '@/lib/worldid/proof'
import { WORLD_ID_CREATE_ACTION } from '@/lib/worldid/actions'

export function useCreateRaffleTx() {
  const { wallets } = useWallets()
  const address = wallets[0]?.address as `0x${string}` | undefined
  const contractAddress = getContractAddress()
  const [pendingHash, setPendingHash] = useState<`0x${string}` | undefined>()

  const { writeContractAsync, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: pendingHash,
  })

  const createRaffle = useCallback(
    async (params: {
      name: string
      endDate: string
      endTime: string
      worldIdResult: IDKitResult
    }) => {
      if (!address) throw new Error('Connect your wallet first.')
      if (!contractAddress) throw new Error('WLD5050 contract address is not configured.')

      const duration = computeRaffleDurationSeconds(params.endDate, params.endTime)
      const { root, nullifierHash, proof } = extractLegacyOrbProof(params.worldIdResult)

      toast.message('Approve USDC creation fee…')
      await writeContractAsync({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [contractAddress, PLATFORM_FEE_USDC_RAW],
      })

      toast.message('Creating raffle on World Chain…')
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: wld5050WriteAbi,
        functionName: 'createRaffle',
        args: [params.name.trim(), duration, PAYMENT_TOKEN_USDC, root, nullifierHash, [...proof]],
      })

      setPendingHash(hash)
      return hash
    },
    [address, contractAddress, writeContractAsync],
  )

  return {
    address,
    contractAddress,
    createRaffle,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: pendingHash,
    worldIdAction: WORLD_ID_CREATE_ACTION,
  }
}

export function useBuyTicketTx(raffleId: number) {
  const { wallets } = useWallets()
  const address = wallets[0]?.address as `0x${string}` | undefined
  const contractAddress = getContractAddress()
  const [pendingHash, setPendingHash] = useState<`0x${string}` | undefined>()

  const { writeContractAsync, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: pendingHash,
  })

  const buyTicket = useCallback(
    async (worldIdResult: IDKitResult) => {
      if (!address) throw new Error('Connect your wallet first.')
      if (!contractAddress) throw new Error('WLD5050 contract address is not configured.')

      const { root, nullifierHash, proof } = extractLegacyOrbProof(worldIdResult)

      toast.message('Approve USDC ticket payment…')
      await writeContractAsync({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [contractAddress, TICKET_PRICE_USDC_RAW],
      })

      toast.message('Buying ticket on World Chain…')
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: wld5050WriteAbi,
        functionName: 'buyTicket',
        args: [BigInt(raffleId), root, nullifierHash, [...proof]],
      })

      setPendingHash(hash)
      return hash
    },
    [address, contractAddress, raffleId, writeContractAsync],
  )

  return {
    address,
    contractAddress,
    buyTicket,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: pendingHash,
  }
}
