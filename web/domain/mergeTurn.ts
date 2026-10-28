import type { TimelineItem, TurnStatus } from './timeline'

const rank: Record<TurnStatus, number> = {
  queued: 1,
  working: 2,
  blocked: 3,
  completed: 4,
  capture_unavailable: 4,
  failed: 4,
  timeout: 4,
}

export function mergeTurn(
  prev: TimelineItem[],
  next: TimelineItem,
): TimelineItem[] {
  const idx = prev.findIndex((t) => t.requestId === next.requestId)
  if (idx === -1) return [...prev, next]
  const current = prev[idx]
  if (rank[current.status] > rank[next.status]) {
    return prev
  }
  const updated = [...prev]
  updated[idx] = next
  return updated
}
