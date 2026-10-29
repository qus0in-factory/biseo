import type { TimelineItem } from '../domain/timeline'
import { TimelineItemView } from './TimelineItemView'
import r from '../resources.json'

type Props = {
  items: TimelineItem[]
  onCancel?: (id: string) => void
}

export function TimelineView({ items, onCancel }: Props) {
  if (items.length === 0) return <p className="spinner">{r.emptyTimeline}</p>
  return (
    <div className="timeline-items">
      {items.map((i) => (
        <TimelineItemView key={i.requestId} item={i} onCancel={onCancel} />
      ))}
    </div>
  )
}
