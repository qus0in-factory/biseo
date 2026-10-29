import { useState, useCallback, useEffect } from 'react'
import type { WorkspaceApiPort as P } from '../domain/ports'
import type { PaneSummary as S, TimelineItem as I } from '../domain/timeline'
import { mergeTurn } from '../domain/mergeTurn'
import { mergeServerTimeline } from '../domain/timelineHydrate'
import { syncPending } from '../domain/syncPending'
import { executeSend } from './sendAction'
import { executeCancel } from './cancelAction'

export function useTimeline(p: P, w: string | null, t?: S) {
  const [items, set] = useState<I[]>([])
  const [busy, setBusy] = useState(false)
  const update = useCallback((x: I) => set((m) => mergeTurn(m, x)), [])
  const reload = useCallback(async () => {
    if (!w || !p.getTimeline) return
    try {
      const list = await p.getTimeline(w)
      set((m) => mergeServerTimeline(m, list))
      await syncPending(p, list, update)
    } catch {}
  }, [p, w, update])
  useEffect(() => {
    void reload()
  }, [reload])
  const send = useCallback((txt: string) => executeSend(p, w, t, txt, set, setBusy), [p, w, t])
  const cancel = useCallback((id: string) => executeCancel(p, id, set), [p])

  return { items, sending: busy, send, cancel, update, reloadTimeline: reload }
}
