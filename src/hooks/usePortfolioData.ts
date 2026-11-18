'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  fetchLivePortfolioData,
  PortfolioData
} from '@/lib/portfolioData'

export function usePortfolioData() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchLivePortfolioData()
      setPortfolio(data)
    } catch (err) {
      console.error('Portfolio loading error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load portfolio content.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { portfolio, loading, error, refresh }
}