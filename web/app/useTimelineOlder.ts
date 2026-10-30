import { useCallback, useRef, useState } from 'react'
import type { WorkspaceApiPort as P } from '../domain/ports'
import type { Paging } from '../domain/timelinePagingTypes'
import { loadOlderPage } from './timelineOlderLoad'

export function useTimelineOlder(
  p: P, w: string | null, paneId: string | null,
  ref: { current: Paging }, setPaging: (f: (s: Paging) => Paging) => void,
  gen: { current: number },
) {
  const [olderLoaded, setOlderLoaded] = useState(0)
  const loading = useRef(false)
  const requested = useRef<number | null>(null)

  const loadOlder = useCallback(async () => {
    const page = await loadOlderPage({ p, w, paneId, ref, setPaging, gen, loading, requested })
    if (page?.items.length) setOlderLoaded((n) => n + 1)
  }, [p, w, paneId, ref, setPaging, gen])

  return { loadOlder, olderLoaded }
}
