export function partitionPanes<T extends { paneId: string }>(
  panes: T[],
  pinnedIds: string[],
): { pinned: T[]; rest: T[] } {
  const pinnedSet = new Set(pinnedIds)
  const byId = new Map(panes.map((pane) => [pane.paneId, pane]))
  const pinned = pinnedIds.map((id) => byId.get(id)).filter((pane): pane is T => Boolean(pane))
  const rest = panes.filter((pane) => !pinnedSet.has(pane.paneId))
  return { pinned, rest }
}
