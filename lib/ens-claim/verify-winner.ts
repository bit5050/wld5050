import 'server-only'

import { getAddress, type Address, type PublicClient } from 'viem'
import { isEnsClaimedOnRegistrar } from '@/lib/ens/fetch-ens-minted'
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

export { isEnsClaimedOnRegistrar }
