import { useState, useEffect } from 'react'
import type { WorkspaceApiPort } from '../domain/ports'

export function useConfig(api: WorkspaceApiPort, enabled: boolean) {
  const [wsId, setWsId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    setLoading(true)
    api.getConfig()
      .then((cfg) => setWsId(cfg.workspaceId))
      .catch(() => setError('connection_unavailable'))
      .finally(() => setLoading(false))
  }, [api, enabled])

  return { wsId, loading, error }
}
