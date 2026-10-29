import type { TimelineItem, TurnStatus } from './timeline'

export function canTransition(
  from: TurnStatus,
  to: TurnStatus,
  fromErr?: string | null,
): boolean {
  if (from === to) return true
  if (from === 'queued') return to !== 'queued'
  if (from === 'working') return to !== 'queued' && to !== 'cancelled'
  if (from === 'timeout') return to === 'completed'
  if (from === 'failed' && fromErr === 'delivery_uncertain') {
    return to === 'working' || to === 'completed'
  }
  return false
}

export function mergeTurn(
  prev: TimelineItem[],
  next: TimelineItem,
): TimelineItem[] {
  const idx = prev.findIndex((t) => t.requestId === next.requestId)
  if (idx === -1) return [...prev, next]
  const current = prev[idx]
  if (!canTransition(current.status, next.status, current.errorCode)) {
    return prev
  }
  const updated = [...prev]
  updated[idx] = next
  return updated
}
