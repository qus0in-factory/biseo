import { useEffect, useState } from 'react'
import type { UsageApiPort, UsageProvider } from '../domain/usage'

export function useUsage(api: UsageApiPort, enabled: boolean) {
  const [providers, setProviders] = useState<UsageProvider[]>([])
  const [stale, setStale] = useState(false)
  const [lastSuccessAt, setLastSuccessAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    let live = true
    const load = () =>
      api
        .getUsage()
        .then((r) => {
          if (!live) return
          setProviders(r.providers ?? [])
          setStale(!!r.stale)
          setLastSuccessAt(r.lastSuccessAt ?? null)
          setError(null)
        })
        .catch(() => live && setError('connection_unavailable'))
    void load()
    const timer = setInterval(load, 60000)
    return () => {
      live = false
      clearInterval(timer)
    }
  }, [api, enabled])

  return { providers, stale, lastSuccessAt, error }
}
