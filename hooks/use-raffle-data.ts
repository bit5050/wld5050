'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import type { Address } from 'viem'
import { publicEnv } from '@/lib/env.public'
import { fetchRaffleById, fetchRafflesFromContract } from '@/lib/contracts/fetch-raffles'
import { isValidContractAddress } from '@/lib/contracts/wld5050'
import type { CompletedRaffle, Raffle } from '@/types'

export function useRaffles() {
  const publicClient = usePublicClient()
  const [active, setActive] = useState<Raffle[]>([])
  const [completed, setCompleted] = useState<CompletedRaffle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const contractAddress = publicEnv.contractAddress as Address
  const hasContract = isValidContractAddress(contractAddress)

  const refresh = useCallback(async () => {
    if (!publicClient || !hasContract) {
      setActive([])
      setCompleted([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchRafflesFromContract(publicClient, contractAddress)
      setActive(data.active)
      setCompleted(data.completed)
    } catch (err) {
      console.error('Raffle fetch failed:', err)
      setError('Could not load raffles from contract.')
      setActive([])
      setCompleted([])
    } finally {
      setIsLoading(false)
    }
  }, [publicClient, contractAddress, hasContract])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { active, completed, isLoading, error, refresh, hasContract }
}

export function useRaffle(raffleId: number) {
  const publicClient = usePublicClient()
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const contractAddress = publicEnv.contractAddress as Address
  const hasContract = isValidContractAddress(contractAddress)

  const refresh = useCallback(async () => {
    if (!publicClient || !hasContract) {
      setRaffle(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchRaffleById(raffleId, publicClient, contractAddress)
      setRaffle(data)
      if (!data) setError('Raffle not found.')
    } catch (err) {
      console.error('Raffle fetch failed:', err)
      setError('Could not load raffle from contract.')
      setRaffle(null)
    } finally {
      setIsLoading(false)
    }
  }, [publicClient, contractAddress, hasContract, raffleId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { raffle, isLoading, error, refresh, hasContract }
}
