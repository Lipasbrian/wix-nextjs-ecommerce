// hooks/useVendorAds.ts
import { useState, useEffect } from 'react'

interface AdData {
  id: string
  title: string
  impressions: number
  clicks: number
  ctr: number
}

interface UseVendorAdsResult {
  data: AdData[]
  loading: boolean
  error: Error | null
}

export function useVendorAds(): UseVendorAdsResult {
  const [data, setData] = useState<AdData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/vendor/ads')
        if (!response.ok) {
          throw new Error('Failed to fetch ads')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}