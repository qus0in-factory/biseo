import { useCallback, useState } from 'react'
import type { WorkspaceApiPort as P } from '../domain/ports'
import type { PaneSummary as S } from '../domain/timeline'
import { executeSend } from './sendAction'
import { executeCancel } from './cancelAction'
import { useTimelinePages } from './useTimelinePages'

export function useTimeline(p: P, w: string | null, t?: S) {
  const paneId = t?.paneId ?? null
  const pg = useTimelinePages(p, w, paneId)
  const [busy, setBusy] = useState(false)
  const send = useCallback((txt: string) => executeSend(p, w, t, txt, pg.setItems, setBusy), [p, w, t, pg.setItems])
  const cancel = useCallback((id: string) => executeCancel(p, id, pg.setItems), [p, pg.setItems])
  return {
    items: pg.items,
    sending: busy,
    send,
    cancel,
    update: pg.update,
    reloadTimeline: pg.reload,
    loadOlder: pg.loadOlder,
    olderLoaded: pg.olderLoaded,
  }
}
