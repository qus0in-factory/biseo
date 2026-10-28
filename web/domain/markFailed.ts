import type { TimelineItem } from '../domain/timeline'

export function markFailed(
  items: TimelineItem[],
  requestId: string,
): TimelineItem[] {
  return items.map((i) =>
    i.requestId === requestId && (i.status === 'queued' || i.status === 'working')
      ? { ...i, status: 'failed', errorCode: 'delivery_uncertain' }
      : i,
  )
}
