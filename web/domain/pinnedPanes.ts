export const MAX_PINNED_PANES = 2

export function parsePinnedPanes(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((value): value is string => typeof value === 'string')
  } catch {
    return []
  }
}

export function serializePinnedPanes(ids: string[]): string {
  return JSON.stringify(ids)
}

export function prunePinnedPanes(ids: string[], available: Iterable<string>): string[] {
  const set = available instanceof Set ? available : new Set(available)
  return ids.filter((id) => set.has(id))
}

export function togglePinnedPane(ids: string[], paneId: string, max = MAX_PINNED_PANES): string[] {
  if (ids.includes(paneId)) return ids.filter((id) => id !== paneId)
  if (ids.length >= max) return ids
  return [...ids, paneId]
}

export function partitionPanes<T extends { paneId: string }>(
  panes: T[],
  pinnedIds: string[],
): { pinned: T[]; rest: T[] } {
  const pinnedSet = new Set(pinnedIds)
  const byId = new Map(panes.map((pane) => [pane.paneId, pane]))
  const pinned = pinnedIds
    .map((id) => byId.get(id))
    .filter((pane): pane is T => Boolean(pane))
  const rest = panes.filter((pane) => !pinnedSet.has(pane.paneId))
  return { pinned, rest }
}
