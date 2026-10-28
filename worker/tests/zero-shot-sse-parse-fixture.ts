import type { TimelineItem } from '../domain/timeline-types.js'

export function parseCompletedTurn(buf: string, id: string): TimelineItem | null {
  for (const b of buf.split('\n\n').slice(0, -1)) {
    if (!b.includes('event: turn.updated')) continue
    const line = b.split('\n').find((l) => l.startsWith('data:'))
    if (!line) continue
    const item = JSON.parse(line.slice(5).trim()) as TimelineItem
    if (item.requestId === id && item.status === 'completed') return item
  }
  return null
}
