import type { TimelineItem } from './timeline'
import { mergeTurn } from './mergeTurn'

export function mergeServerTimeline(current: TimelineItem[], items: TimelineItem[]): TimelineItem[] {
  return items.reduce((acc, item) => mergeTurn(acc, item), current)
}
