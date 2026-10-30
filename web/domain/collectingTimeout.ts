import type { TimelineItem } from './timeline-item'

export const hasCollectingTimeout = (items: TimelineItem[]) =>
  items.some((i) => i.status === 'timeout' && i.errorCode !== 'late_capture_expired')
