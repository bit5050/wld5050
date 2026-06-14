'use client'

import { useCallback, useState } from 'react'
import type { IDKitResult } from '@worldcoin/idkit'
import { useWallets } from '@privy-io/react-auth'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'sonner'
import { worldchain } from '@/lib/chains/worldchain'
import {
  PAYMENT_TOKEN_USDC,
  PAYMENT_TOKEN_WLD,
  PLATFORM_FEE_USDC_RAW,
  PLATFORM_FEE_WLD_RAW,
  TICKET_PRICE_USDC_RAW,
  TICKET_PRICE_WLD_RAW,
  USDC_ADDRESS,
  WLD_TOKEN_ADDRESS,
  wld5050WriteAbi,
  wld5050Abi,
  type PaymentToken,
} from '@/lib/contracts/wld5050'
import { computeRaffleDurationSeconds, getContractAddress } from '@/lib/contracts/raffle-tx'
import { getPublicClient } from '@/lib/contracts/public-client'
import { parseRaffleIdFromReceipt } from '@/lib/contracts/parse-raffle-created'
import { friendlyTxError } from '@/lib/contracts/decode-tx-error'
import { erc20Abi } from '@/lib/contracts/wld5050'
import { extractLegacyOrbProof } from '@/lib/worldid/proof'
import { WORLD_ID_CREATE_ACTION } from '@/lib/worldid/actions'

export type CreateRaffleResult = {
  txHash: `0x${string}`
  raffleId: number
}

const TOKEN_CONFIG: Record<
  PaymentToken,
  { address: typeof USDC_ADDRESS; feeRaw: bigint; ticketRaw: bigint; index: number }
> = {
  USDC: {
    address: USDC_ADDRESS,
    feeRaw: PLATFORM_FEE_USDC_RAW,
    ticketRaw: TICKET_PRICE_USDC_RAW,
    index: PAYMENT_TOKEN_USDC,
  },
  WLD: {
    address: WLD_TOKEN_ADDRESS,
    feeRaw: PLATFORM_FEE_WLD_RAW,
    ticketRaw: TICKET_PRICE_WLD_RAW,
    index: PAYMENT_TOKEN_WLD,
  },
}

type ApproveWriteFn = (args: {
  chainId: typeof worldchain.id
  address: typeof USDC_ADDRESS | typeof WLD_TOKEN_ADDRESS
  abi: typeof erc20Abi
  functionName: 'approve'
  args: [`0x${string}`, bigint]
}) => Promise<`0x${string}`>

async function ensureTokenAllowance(
  publicClient: ReturnType<typeof getPublicClient>,
  token: PaymentToken,
  owner: `0x${string}`,
  spender: `0x${string}`,
  required: bigint,
  writeContractAsync: ApproveWriteFn,
) {
  const { address } = TOKEN_CONFIG[token]

  const allowance = await publicClient.readContract({
    address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner, spender],
  })

  if (allowance >= required) return

  toast.message(`Approve ${token}…`)
  const approveHash = await writeContractAsync({
    chainId: worldchain.id,
    address,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spender, required],
  })
  await publicClient.waitForTransactionReceipt({ hash: approveHash })
}

export function useCreateRaffleTx() {
  const { wallets } = useWallets()
  const publicClient = getPublicClient()
  const address = wallets[0]?.address as `0x${string}` | undefined
  const contractAddress = getContractAddress()
  const [pendingHash, setPendingHash] = useState<`0x${string}` | undefined>()

  const { writeContractAsync, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: pendingHash,
    chainId: worldchain.id,
  })

  const createRaffle = useCallback(
    async (params: {
      name: string
      endDate: string
      endTime: string
      paymentToken: PaymentToken
      worldIdResult: IDKitResult
    }): Promise<CreateRaffleResult> => {
      if (!address) throw new Error('Connect your wallet first.')
      if (!contractAddress) throw new Error('WLD5050 contract address is not configured.')

      const duration = computeRaffleDurationSeconds(params.endDate, params.endTime)
      const { root, nullifierHash, proof } = extractLegacyOrbProof(params.worldIdResult)
      const { feeRaw, index } = TOKEN_CONFIG[params.paymentToken]

      await ensureTokenAllowance(
        publicClient,
        params.paymentToken,
        address,
        contractAddress,
        feeRaw,
        writeContractAsync,
      )

      toast.message('Creating raffle on World Chain…')
      try {
        const hash = await writeContractAsync({
          chainId: worldchain.id,
          address: contractAddress,
          abi: wld5050WriteAbi,
          functionName: 'createRaffle',
          args: [params.name.trim(), duration, index, root, nullifierHash, [...proof]],
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

export function useBuyTicketTx(raffleId: number, paymentToken?: PaymentToken) {
  const { wallets } = useWallets()
  const publicClient = getPublicClient()
  const address = wallets[0]?.address as `0x${string}` | undefined
  const contractAddress = getContractAddress()
  const [pendingHash, setPendingHash] = useState<`0x${string}` | undefined>()

  const { writeContractAsync, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: pendingHash,
    chainId: worldchain.id,
  })

  const buyTicket = useCallback(
    async (worldIdResult: IDKitResult) => {
      if (!address) throw new Error('Connect your wallet first.')
      if (!contractAddress) throw new Error('WLD5050 contract address is not configured.')
      if (!paymentToken) throw new Error('Raffle payment token is not loaded yet.')

      const { root, nullifierHash, proof } = extractLegacyOrbProof(worldIdResult)
      const { ticketRaw } = TOKEN_CONFIG[paymentToken]

      await ensureTokenAllowance(
        publicClient,
        paymentToken,
        address,
        contractAddress,
        ticketRaw,
        writeContractAsync,
      )

      toast.message(`Buying ticket with ${paymentToken}…`)
      try {
        const hash = await writeContractAsync({
          chainId: worldchain.id,
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
    [address, contractAddress, paymentToken, publicClient, raffleId, writeContractAsync],
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
