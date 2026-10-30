import { useCallback, useRef, useState } from 'react'
import type { TimelineItem as I } from '../domain/timeline'
import { mergeTurn } from '../domain/mergeTurn'
import { startPaging } from '../domain/timelinePaging'
import type { Paging } from '../domain/timelinePagingTypes'

export function useTimelinePager(paneId: string | null) {
  const [paging, setPaging] = useState<Paging>(startPaging)
  const ref = useRef(paging)
  ref.current = paging

  const update = useCallback((x: I) => {
    if (!paneId || x.paneId !== paneId) return
    setPaging((s) => ({ ...s, items: mergeTurn(s.items, x) }))
  }, [paneId])

  const setItems = useCallback((u: I[] | ((m: I[]) => I[])) => {
    setPaging((s) => ({ ...s, items: typeof u === 'function' ? u(s.items) : u }))
  }, [])

  const reset = useCallback(() => {
    const p = startPaging()
    ref.current = p
    setPaging(p)
  }, [])

  return { paging, setPaging, ref, update, setItems, reset }
}
