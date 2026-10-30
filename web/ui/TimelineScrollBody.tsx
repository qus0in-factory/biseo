import type { TimelineItem } from '../domain/timeline'
import { TimelineItemView } from './TimelineItemView'
import { useTimelineScroll } from './useTimelineScroll'
import { JumpToBottomButton } from './JumpToBottomButton'

export function TimelineScrollBody({
  items,
  onCancel,
  onLoadOlder,
  olderLoaded,
}: {
  items: TimelineItem[]
  onCancel?: (id: string) => void
  onLoadOlder?: () => void
  olderLoaded?: number
}) {
  const { ref, showJump, scrollToBottom, onScroll } = useTimelineScroll(items, onLoadOlder, olderLoaded)
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div ref={ref} className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain" onScroll={onScroll}>
        {items.map((i) => <TimelineItemView key={i.requestId} item={i} onCancel={onCancel} />)}
      </div>
      {showJump && <JumpToBottomButton onClick={scrollToBottom} />}
    </div>
  )
}
