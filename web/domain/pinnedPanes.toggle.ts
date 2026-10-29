import { MAX_PINNED_PANES } from './pinnedPaneLimits.js'

export function togglePinnedPane(ids: string[], paneId: string, max = MAX_PINNED_PANES): string[] {
  if (ids.includes(paneId)) return ids.filter((id) => id !== paneId)
  if (ids.length >= max) return ids
  return [...ids, paneId]
}
