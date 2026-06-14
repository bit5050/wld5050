import 'server-only'

import {
  createPublicClient,
  getAddress,
  http,
  type Address,
  type PublicClient,
} from 'viem'
import { mainnet } from 'viem/chains'
import { getWld5050ContractAddress } from '@/lib/contracts/contract-address'
import { fetchRaffleSettlement } from '@/lib/contracts/fetch-raffle-settlement'
import { getPublicClient } from '@/lib/contracts/public-client'
import { wld5050Abi } from '@/lib/contracts/wld5050'

export type WinnerVerification = {
  raffleId: number
  winner: Address
  winnerSubname: string
}

export async function verifyRaffleWinner(
  raffleId: number,
  claimant: Address,
): Promise<WinnerVerification | null> {
  const contractAddress = getWld5050ContractAddress()
  const worldClient = getPublicClient()

  const state = await worldClient.readContract({
    address: contractAddress,
    abi: wld5050Abi,
    functionName: 'getRaffleState',
    args: [BigInt(raffleId)],
  })

  const ticketsSold = Number(state[2])
  const status = Number(state[7])
  if (status !== 1) return null

  const settlement = await fetchRaffleSettlement(
    raffleId,
    worldClient as PublicClient,
    contractAddress,
    ticketsSold,
  )
  if (!settlement) return null

  const winner = getAddress(settlement.winner)
  if (getAddress(claimant) !== winner) return null

  return {
    raffleId,
    winner,
    winnerSubname: settlement.winnerSubname,
  }
}

export async function isEnsClaimedOnRegistrar(raffleId: number): Promise<boolean> {
  const registrar = process.env.NEXT_PUBLIC_WINNER_ENS_CLAIM_REGISTRAR?.trim()
  if (!registrar || !/^0x[a-fA-F0-9]{40}$/.test(registrar)) return false

  const rpcUrl = process.env.ETH_MAINNET_RPC_URL
  if (!rpcUrl) return false

  const client = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  })

  return client.readContract({
    address: registrar as Address,
    abi: [
      {
        type: 'function',
        name: 'claimed',
        stateMutability: 'view',
        inputs: [{ name: 'raffleId', type: 'uint256' }],
        outputs: [{ type: 'bool' }],
      },
    ],
    functionName: 'claimed',
    args: [BigInt(raffleId)],
  })
}
