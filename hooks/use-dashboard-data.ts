'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { publicEnv } from '@/lib/env.public'
import { isValidContractAddress } from '@/lib/contracts/wld5050'
import { fetchDashboardData } from '@/lib/dashboard/fetch-dashboard-data'
import { emptyDashboardData, type DashboardData } from '@/lib/dashboard/types'

export function useDashboardData(address: Address | undefined) {
  const publicClient = usePublicClient()
  const [data, setData] = useState<DashboardData>(emptyDashboardData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const contractAddress = publicEnv.contractAddress as Address
  const hasContract = isValidContractAddress(contractAddress)

  const refresh = useCallback(async () => {
    if (!address || !publicClient) {
      setData(emptyDashboardData)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchDashboardData(publicClient, contractAddress, address)
      setData(result)
    } catch (err) {
      console.error('Dashboard fetch failed:', err)
      setError('Could not load dashboard data. Try refreshing.')
      setData(emptyDashboardData)
    } finally {
      setIsLoading(false)
    }
  }, [address, publicClient, contractAddress])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, isLoading, error, refresh, hasContract }
}
