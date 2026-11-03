import { useCallback, useEffect, useRef, useState } from 'react'
import type { WorkspaceApiPort as P } from '../domain/ports'
import type { PaneSummary as S } from '../domain/timeline'
import { executeSend } from './sendAction'
import { executeCancel } from './cancelAction'
import { useTimelinePages } from './useTimelinePages'

export function useTimeline(p: P, w: string | null, t?: S, blocked = false) {
  const pg = useTimelinePages(p, w, t?.paneId ?? null)
  const [busy, setBusy] = useState(false)
  const g = useRef({ w, key: 0 })
  if (g.current.w !== w) g.current = { w, key: g.current.key + 1 }
  useEffect(() => {
    setBusy(false)
  }, [w])
  const send = useCallback((txt: string) => {
    if (blocked) return
    const k = g.current.key
    return executeSend(p, w, t, txt, pg.setItems, setBusy, () => g.current.key === k)
  }, [p, w, t, pg.setItems, blocked])
  const cancel = useCallback((id: string) => executeCancel(p, id, pg.setItems), [p, pg.setItems])
  return {
    items: pg.items,
    sending: busy || blocked,
    send,
    cancel,
    update: pg.update,
    reloadTimeline: pg.reload,
    retryTimeline: pg.reload,
    timelineState: pg.timelineState,
    loadOlder: pg.loadOlder,
    olderLoaded: pg.olderLoaded,
  }
}
