import { useRef, useState } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'

export function useSortableList(ids: string[], onReorder: (from: number, to: number) => void) {
  const [busy, setBusy] = useState(false)
  const list = useRef(ids)
  if (!busy) list.current = ids
  const end = ({ active, over }: DragEndEvent) => {
    setBusy(false)
    if (!over || active.id === over.id) return
    const from = list.current.indexOf(String(active.id))
    const to = list.current.indexOf(String(over.id))
    if (from >= 0 && to >= 0) onReorder(from, to)
  }
  return { items: list.current, start: () => setBusy(true), stop: () => setBusy(false), end }
}
