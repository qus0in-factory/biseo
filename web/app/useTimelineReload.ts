import { useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { WorkspaceApiPort as P } from '../domain/ports'
import { mergeLatest } from '../domain/timelinePaging'
import type { Paging } from '../domain/timelinePagingTypes'

export function useTimelineReload(
  p: P, w: string | null, paneId: string | null,
  setPaging: Dispatch<SetStateAction<Paging>>, gen: { current: number },
) {
  return useCallback(async () => {
    if (!w || !paneId || !p.getTimeline) return
    const g = gen.current
    try {
      const page = await p.getTimeline(w, { paneId, limit: 3 })
      if (g === gen.current) setPaging((s) => mergeLatest(s, page))
    } catch {}
  }, [p, w, paneId, setPaging, gen])
}
