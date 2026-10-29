import type { TimelineItem } from '../domain/timeline'
import { UserBubble } from './UserBubble'
import { AgentBubble } from './AgentBubble'

export function TimelineItemView({
  item,
  onCancel,
}: {
  item: TimelineItem
  onCancel?: (id: string) => void
}) {
  return (
    <article className="flex w-full flex-col gap-2">
      <UserBubble item={item} />
      <AgentBubble item={item} onCancel={onCancel} />
    </article>
  )
}
