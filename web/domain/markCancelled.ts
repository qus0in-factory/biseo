import type { TimelineItem } from './timeline'
import { mergeTurn } from './mergeTurn'

export function markCancelled(
  items: TimelineItem[],
  requestId: string,
): TimelineItem[] {
  const it = items.find((x) => x.requestId === requestId)
  return it ? mergeTurn(items, { ...it, status: 'cancelled' }) : items
}
