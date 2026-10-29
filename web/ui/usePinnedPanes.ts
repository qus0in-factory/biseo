import { useEffect, useState } from 'react'
import { parsePinnedPanes, prunePinnedPanes, serializePinnedPanes } from '../domain/pinnedPanes.js'
import r from '../resources.json'

export function usePinnedPanes(panes: { paneId: string }[], key: string) {
  const [pinned, setPinned] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : parsePinnedPanes(window.localStorage.getItem(key)),
  )

  useEffect(() => {
    if (panes.length === 0) return
    const available = new Set(panes.map((pane) => pane.paneId))
    setPinned((prev) => {
      const next = prunePinnedPanes(prev, available)
      if (next.length===prev.length && next.every((id,i)=>id===prev[i])) return prev
      try { window.localStorage.setItem(key, serializePinnedPanes(next)) } catch {}
      return next
    })
  }, [panes, key])

  const updatePinned = (next: string[]) => {
    setPinned(next)
    try { window.localStorage.setItem(key, serializePinnedPanes(next)) } catch {}
  }

  return { pinned, updatePinned }
}
