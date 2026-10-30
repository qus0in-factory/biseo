import { useEffect } from 'react'
import { prunePinnedPanes, serializePinnedPanes } from '../domain/pinnedPanes.js'
import { useUiStore } from '../app/uiStore'

export function usePinnedPanes(panes: { paneId: string }[], key: string) {
  const pinned = useUiStore((s) => s.pinned)
  const setPinned = useUiStore((s) => s.setPinned)

  useEffect(() => {
    if (panes.length === 0) return
    const next = prunePinnedPanes(pinned, panes.map((pane) => pane.paneId))
    if (next.length === pinned.length && next.every((id, i) => id === pinned[i])) return
    setPinned(next)
    try { window.localStorage.setItem(key, serializePinnedPanes(next)) } catch {}
  }, [panes, pinned, key, setPinned])

  const updatePinned = (next: string[]) => {
    setPinned(next)
    try { window.localStorage.setItem(key, serializePinnedPanes(next)) } catch {}
  }

  return { pinned, updatePinned }
}
