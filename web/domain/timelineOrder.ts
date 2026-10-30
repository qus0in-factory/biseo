import type { TimelineItem } from './timeline-item'

const at = (x: TimelineItem) => {
  const t = Date.parse(x.createdAt)
  return Number.isNaN(t) ? 0 : t
}

export const byCreatedAt = (a: TimelineItem, b: TimelineItem) =>
  at(a) - at(b) || (a.seq ?? 0) - (b.seq ?? 0)

// D1 lists newest first and mergeTurn appends, so every merge restores oldest-first order.
export const ordered = (items: TimelineItem[]) => [...items].sort(byCreatedAt)
