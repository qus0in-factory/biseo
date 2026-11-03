import { useCallback, useEffect, useRef, useState } from 'react'
import type { WorkspaceApiPort } from '../domain/ports'
import { createSelectionGate } from './workspaceSelection'

export function useConfig(api: WorkspaceApiPort, enabled: boolean) {
  const [wsId, setWsId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const gate = useRef(createSelectionGate())

  const applyWsId = useCallback((workspaceId: string) => {
    gate.current.begin()
    setWsId(workspaceId)
    setLoading(false)
    setError(null)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const token = gate.current.begin()
    setLoading(true)
    api.getConfig()
      .then((cfg) => {
        if (!gate.current.isCurrent(token)) return
        setWsId(cfg.workspaceId)
        setError(null)
      })
      .catch(() => {
        if (gate.current.isCurrent(token)) setError('connection_unavailable')
      })
      .finally(() => {
        if (gate.current.isCurrent(token)) setLoading(false)
      })
  }, [api, enabled])

  return { wsId, applyWsId, loading, error }
}
