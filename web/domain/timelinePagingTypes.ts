import type { TimelineItem } from './timeline-item'

export type TimelinePage = { items: TimelineItem[]; hasMore: boolean; nextBefore: number | null }
export type Paging = { items: TimelineItem[]; hasMore: boolean; before: number | null }
export type TimelineQuery = { paneId?: string; before?: number | null; limit?: number }
