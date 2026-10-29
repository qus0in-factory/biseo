import type { TimelineItem } from '../domain/timeline'
import { TimelineItemView } from './TimelineItemView'
import { useTimelineScroll } from './useTimelineScroll'
import { JumpToBottomButton } from './JumpToBottomButton'
import r from '../resources.json'

type Props = {
  items: TimelineItem[]
  onCancel?: (id: string) => void
}

export function TimelineView({ items, onCancel }: Props) {
  const { ref, showJump, scrollToBottom, onScroll } = useTimelineScroll(items)

  if (items.length === 0) return <p className="spinner">{r.emptyTimeline}</p>

  return (
    <div className="timeline-container">
      <div ref={ref} className="timeline-items" onScroll={onScroll}>
        {items.map((i) => (
          <TimelineItemView key={i.requestId} item={i} onCancel={onCancel} />
        ))}
      </div>
      {showJump && <JumpToBottomButton onClick={scrollToBottom} />}
    </div>
  )
}
