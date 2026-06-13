'use client'

import { useCallback, useState } from 'react'
import type { IDKitResult } from '@worldcoin/idkit'
import { useWallets } from '@privy-io/react-auth'
import { usePublicClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'sonner'
import {
  PAYMENT_TOKEN_USDC,
  PLATFORM_FEE_USDC_RAW,
  TICKET_PRICE_USDC_RAW,
  USDC_ADDRESS,
  wld5050WriteAbi,
  wld5050Abi,
} from '@/lib/contracts/wld5050'
import { computeRaffleDurationSeconds, getContractAddress } from '@/lib/contracts/raffle-tx'
import { parseRaffleIdFromReceipt } from '@/lib/contracts/parse-raffle-created'
import { friendlyTxError } from '@/lib/contracts/decode-tx-error'
import { erc20Abi } from '@/lib/contracts/wld5050'
import { extractLegacyOrbProof } from '@/lib/worldid/proof'
import { WORLD_ID_CREATE_ACTION } from '@/lib/worldid/actions'

export type CreateRaffleResult = {
  txHash: `0x${string}`
  raffleId: number
}

async function ensureUsdcAllowance(
  publicClient: ReturnType<typeof usePublicClient>,
  owner: `0x${string}`,
  spender: `0x${string}`,
  required: bigint,
  writeContractAsync: (variables: {
    address: `0x${string}`
    abi: typeof erc20Abi
    functionName: 'approve'
    args: [`0x${string}`, bigint]
  }) => Promise<`0x${string}`>,
) {
  if (!publicClient) return

  const allowance = await publicClient.readContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner, spender],
  })

  if (allowance >= required) return

  toast.message('Approve USDC…')
  const approveHash = await writeContractAsync({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spender, required],
  })
  await publicClient.waitForTransactionReceipt({ hash: approveHash })
}

export function useCreateRaffleTx() {
  const { wallets } = useWallets()
  const publicClient = usePublicClient()
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
    }): Promise<CreateRaffleResult> => {
      if (!address) throw new Error('Connect your wallet first.')
      if (!contractAddress) throw new Error('WLD5050 contract address is not configured.')
      if (!publicClient) throw new Error('World Chain RPC is not available.')

      const duration = computeRaffleDurationSeconds(params.endDate, params.endTime)
      const { root, nullifierHash, proof } = extractLegacyOrbProof(params.worldIdResult)

      await ensureUsdcAllowance(
        publicClient,
        address,
        contractAddress,
        PLATFORM_FEE_USDC_RAW,
        writeContractAsync,
      )

      toast.message('Creating raffle on World Chain…')
      try {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: wld5050WriteAbi,
          functionName: 'createRaffle',
          args: [params.name.trim(), duration, PAYMENT_TOKEN_USDC, root, nullifierHash, [...proof]],
        })
        setPendingHash(hash)

        toast.message('Waiting for confirmation…')
        const receipt = await publicClient.waitForTransactionReceipt({ hash })

        let raffleId = parseRaffleIdFromReceipt(receipt, contractAddress)
        if (raffleId === null) {
          const count = await publicClient.readContract({
            address: contractAddress,
            abi: wld5050Abi,
            functionName: 'raffleCount',
          })
          raffleId = Number(count)
        }

        return { txHash: hash, raffleId }
      } catch (error) {
        throw new Error(friendlyTxError(error))
      }
    },
    [address, contractAddress, publicClient, writeContractAsync],
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
  const publicClient = usePublicClient()
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

      await ensureUsdcAllowance(
        publicClient,
        address,
        contractAddress,
        TICKET_PRICE_USDC_RAW,
        writeContractAsync,
      )

      toast.message('Buying ticket on World Chain…')
      try {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: wld5050WriteAbi,
          functionName: 'buyTicket',
          args: [BigInt(raffleId), root, nullifierHash, [...proof]],
        })
        setPendingHash(hash)
        return hash
      } catch (error) {
        throw new Error(friendlyTxError(error))
      }
    },
    [address, contractAddress, publicClient, raffleId, writeContractAsync],
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
