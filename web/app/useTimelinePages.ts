import { useEffect, useRef } from 'react'
import type { WorkspaceApiPort as P } from '../domain/ports'
import { useTimelinePager } from './useTimelinePager'
import { useTimelineReload } from './useTimelineReload'
import { useTimelineOlder } from './useTimelineOlder'

export function useTimelinePages(p: P, w: string | null, paneId: string | null) {
  const { paging, setPaging, ref, update, setItems, reset } = useTimelinePager(paneId)
  const gen = useRef(0)
  const reload = useTimelineReload(p, w, paneId, setPaging, gen)
  const older = useTimelineOlder(p, w, paneId, ref, setPaging, gen)

  useEffect(() => {
    gen.current++
    reset()
    void reload()
  }, [reset, reload])

  return { items: paging.items, hasMore: paging.hasMore, update, setItems, reload, ...older }
}