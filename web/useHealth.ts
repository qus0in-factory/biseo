import { useState, useEffect, useCallback } from 'react'
import { ApiError, type Health, type HealthPort } from './domain/auth'
import r from './resources.json'
export type { Health }
export function useHealth(
  port: HealthPort,
  enabled: boolean,
  onUnauthed: () => void,
) {
  const [data, setData] = useState<Health | null>(null)
  const [loading, setLoading] = useState(false)
  const check = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      setData(await port.getHealth())
    } catch (e) {
      if (e instanceof ApiError && e.code === 'authFailed') {
        onUnauthed()
        return
      }
      setData({ error: r.unknown })
    } finally {
      setLoading(false)
    }
  }, [port, enabled, onUnauthed])
  useEffect(() => {
    check()
  }, [check])
  return { data, loading, check }
}
