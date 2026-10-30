import type { TimelineItem } from './timeline'
import { canTransition } from './canTransition'
export { canTransition }

export function mergeTurn(prev: TimelineItem[], next: TimelineItem): TimelineItem[] {
  const i = prev.findIndex((x) => x.requestId === next.requestId)
  if (i === -1) return [...prev, next]
  const cur = prev[i]
  if (!canTransition(cur.status, next.status, cur.errorCode)) return prev
  const res = [...prev]
  res[i] = {
    ...cur,
    ...next,
    responseText: next.responseText ?? cur.responseText,
    completedAt: next.completedAt ?? cur.completedAt,
    errorCode: next.errorCode ?? (cur.errorCode === 'delivery_uncertain' && next.status !== 'failed' ? null : cur.errorCode),
  }
  return res
}
