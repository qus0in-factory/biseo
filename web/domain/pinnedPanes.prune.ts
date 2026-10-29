import { MAX_PINNED_PANES } from './pinnedPaneLimits.js'

export function prunePinnedPanes(ids: string[], available: Iterable<string>): string[] {
  const set = available instanceof Set ? available : new Set(available)
  return ids.filter((id) => set.has(id)).slice(0, MAX_PINNED_PANES)
}
