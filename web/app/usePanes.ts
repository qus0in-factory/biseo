import { useState, useCallback } from 'react'
import type { WorkspaceApiPort } from '../domain/ports'
import type { PaneSummary } from '../domain/timeline'
import { markOffline } from '../domain/markOffline'

export function usePanes(api: WorkspaceApiPort, wsId: string | null) {
  const [panes, set] = useState<PaneSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!wsId) return
    setLoading(true)
    setError(null)
    try {
      set(await api.getPanes(wsId))
    } catch {
      setError('connection_unavailable')
    } finally {
      setLoading(false)
    }
  }, [api, wsId])

  const setSnapshot = useCallback((l: PaneSummary[]) => {
    setError(null)
    set(l)
  }, [])

  const markDisconnected = useCallback(() => {
    setError('connection_unavailable')
    set((prev) => markOffline(prev))
  }, [])

  return { panes, loading, error, reload, setSnapshot, markDisconnected }
}
