'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import type { Address, PublicClient } from 'viem'
import { publicEnv } from '@/lib/env.public'
import { fetchRaffleById, fetchRafflesFromContract } from '@/lib/contracts/fetch-raffles'
import { getPublicClient } from '@/lib/contracts/public-client'
import { isValidContractAddress } from '@/lib/contracts/wld5050'
import type { CompletedRaffle, Raffle } from '@/types'

function resolvePublicClient(wagmiClient: PublicClient | undefined): PublicClient {
  return wagmiClient ?? getPublicClient()
}

export function useRaffles() {
  const wagmiClient = usePublicClient()
  const publicClient = resolvePublicClient(wagmiClient)
  const [active, setActive] = useState<Raffle[]>([])
  const [completed, setCompleted] = useState<CompletedRaffle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const contractAddress = publicEnv.contractAddress as Address
  const hasContract = isValidContractAddress(contractAddress)

  const refresh = useCallback(async () => {
    if (!hasContract) {
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
  const wagmiClient = usePublicClient()
  const publicClient = resolvePublicClient(wagmiClient)
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const contractAddress = publicEnv.contractAddress as Address
  const hasContract = isValidContractAddress(contractAddress)

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    if (!hasContract || !Number.isFinite(raffleId) || raffleId < 1) {
      setRaffle(null)
      setError(Number.isFinite(raffleId) && raffleId >= 1 ? null : 'Invalid raffle id.')
      setIsLoading(false)
      return
    }

    if (!options?.silent) {
      setIsLoading(true)
    }
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
      if (!options?.silent) {
        setIsLoading(false)
      }
    }
  }, [publicClient, contractAddress, hasContract, raffleId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!raffle || raffle.status === 'SETTLED') return

    const endTimeMs = raffle.endTime * 1000
    if (Date.now() < endTimeMs - 60_000) return

    const interval = setInterval(() => {
      refresh({ silent: true })
    }, 30_000)

    return () => clearInterval(interval)
  }, [raffle, refresh])

  return { raffle, isLoading, error, refresh, hasContract }
}
