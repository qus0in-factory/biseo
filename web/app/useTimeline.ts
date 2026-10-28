import { useState, useCallback } from 'react'
import type { WorkspaceApiPort as P } from '../domain/ports'
import type { PaneSummary as S, TimelineItem as I } from '../domain/timeline'
import { mergeTurn } from '../domain/mergeTurn'
import { markFailed } from '../domain/markFailed'
import { prepareTurn, submitTurn } from '../domain/sendTurn'

export function useTimeline(p: P, w: string | null, t?: S) {
  const [items, set] = useState<I[]>([])
  const [busy, setBusy] = useState(false)
  const update = useCallback((x: I) => set((m) => mergeTurn(m, x)), [])

  const send = useCallback(async (txt: string) => {
    const s = txt.trim()
    if (!w || !t?.sendable || !s) return
    setBusy(true)
    const { item, input } = prepareTurn(w, t, s)
    set((m) => mergeTurn(m, item))
    try {
      await submitTurn(p, input)
    } catch {
      set((m) => markFailed(m, input.requestId))
    } finally {
      setBusy(false)
    }
  }, [p, w, t])

  return { items, sending: busy, send, update }
}
