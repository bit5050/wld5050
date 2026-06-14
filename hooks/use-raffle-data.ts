'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useWatchContractEvent } from 'wagmi'
import type { Address } from 'viem'
import { worldchain } from '@/lib/chains/worldchain'
import { publicEnv } from '@/lib/env.public'
import {
  fetchRaffleById,
  fetchRaffleTicketsSold,
  fetchRafflesFromContract,
} from '@/lib/contracts/fetch-raffles'
import { fetchRaffleSettlement } from '@/lib/contracts/fetch-raffle-settlement'
import { getPublicClient } from '@/lib/contracts/public-client'
import { isValidContractAddress, wld5050Abi } from '@/lib/contracts/wld5050'
import type { CompletedRaffle, Raffle, Settlement } from '@/types'

/** World Chain reads must not follow the wallet's active chain (e.g. Ethereum for ENS claim). */
const worldChainClient = getPublicClient()

export function useRaffles() {
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
      const data = await fetchRafflesFromContract(worldChainClient, contractAddress)
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
  }, [contractAddress, hasContract])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { active, completed, isLoading, error, refresh, hasContract }
}

export function useRaffle(raffleId: number) {
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [settlement, setSettlement] = useState<Settlement | null>(null)
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
      const data = await fetchRaffleById(raffleId, worldChainClient, contractAddress)
      setRaffle(data)
      if (!data) {
        setError('Raffle not found.')
        setSettlement(null)
      } else if (data.status === 'SETTLED') {
        const settled = await fetchRaffleSettlement(
          raffleId,
          worldChainClient,
          contractAddress,
          data.ticketsSold,
        )
        setSettlement(settled)
      } else {
        setSettlement(null)
      }
    } catch (err) {
      console.error('Raffle fetch failed:', err)
      setError('Could not load raffle from contract.')
      setRaffle(null)
      setSettlement(null)
    } finally {
      if (!options?.silent) {
        setIsLoading(false)
      }
    }
  }, [contractAddress, hasContract, raffleId])

  const refreshStats = useCallback(async () => {
    if (!hasContract || !Number.isFinite(raffleId) || raffleId < 1) return

    try {
      const ticketsSold = await fetchRaffleTicketsSold(raffleId, worldChainClient, contractAddress)
      if (ticketsSold === null) return
      setRaffle((prev) => (prev ? { ...prev, ticketsSold } : prev))
    } catch (err) {
      console.error('Raffle stats refresh failed:', err)
    }
  }, [contractAddress, hasContract, raffleId])

  const refreshStatsRef = useRef(refreshStats)
  refreshStatsRef.current = refreshStats

  const refreshRef = useRef(refresh)
  refreshRef.current = refresh

  useWatchContractEvent({
    address: hasContract ? contractAddress : undefined,
    abi: wld5050Abi,
    chainId: worldchain.id,
    eventName: 'TicketPurchased',
    args: Number.isFinite(raffleId) && raffleId >= 1 ? { raffleId: BigInt(raffleId) } : undefined,
    enabled: hasContract && Number.isFinite(raffleId) && raffleId >= 1 && raffle?.status === 'ACTIVE',
    onLogs() {
      void refreshStatsRef.current()
    },
  })

  useWatchContractEvent({
    address: hasContract ? contractAddress : undefined,
    abi: wld5050Abi,
    chainId: worldchain.id,
    eventName: 'RaffleSettled',
    args: Number.isFinite(raffleId) && raffleId >= 1 ? { raffleId: BigInt(raffleId) } : undefined,
    enabled:
      hasContract &&
      Number.isFinite(raffleId) &&
      raffleId >= 1 &&
      raffle != null &&
      raffle.status !== 'SETTLED',
    onLogs() {
      void refreshRef.current({ silent: true })
    },
  })

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

  return { raffle, settlement, isLoading, error, refresh, refreshStats, hasContract }
}
