import { useState, useEffect, useCallback } from 'react'
import ky from 'ky'
import r from './resources.json'

export type Health = { status?: string; error?: string }

export function useHealth() {
  const [data, setData] = useState<Health | null>(null)
  const [loading, setLoading] = useState(false)

  const check = useCallback(async () => {
    setLoading(true)
    try {
      const res = await ky.get('/api/health', { retry: 0 }).json<Health>()
      setData(res)
    } catch {
      setData({ error: r.unknown })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    check()
  }, [check])

  return { data, loading, check }
}
