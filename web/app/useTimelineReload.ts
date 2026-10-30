import { useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { WorkspaceApiPort as P } from '../domain/ports'
import { mergeLatest } from '../domain/timelinePaging'
import type { Paging } from '../domain/timelinePagingTypes'

export function useTimelineReload(
  p: P, w: string | null, paneId: string | null,
  setPaging: Dispatch<SetStateAction<Paging>>, gen: { current: number },
  onStart: () => void, onDone: (error: string | null) => void,
) {
  return useCallback(async () => {
    if (!w || !paneId || !p.getTimeline) return
    onStart()
    const g = gen.current
    try {
      const page = await p.getTimeline(w, { paneId, limit: 3 })
      if (g !== gen.current) return
      setPaging((s) => mergeLatest(s, page))
      onDone(null)
    } catch {
      if (g === gen.current) onDone('connection_unavailable')
    }
  }, [p, w, paneId, setPaging, gen, onStart, onDone])
}
