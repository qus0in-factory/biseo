import { useEffect, useRef } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { usePaneOrder } from '../app/usePaneOrder'

export function usePanesView({ panes, selectedId }: { panes: PaneSummary[]; selectedId: string | null }) {
  const view = usePaneOrder(panes)
  const refs = useRef(new Map<string, HTMLLIElement>())
  useEffect(() => {
    if (!selectedId) return
    refs.current.get(selectedId)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedId])
  if (!panes.length) return null
  const register = (paneId: string) => (element: HTMLLIElement | null) => {
    if (element) refs.current.set(paneId, element)
    else refs.current.delete(paneId)
  }
  return { panes: view.panes, register, move: view.move }
}
