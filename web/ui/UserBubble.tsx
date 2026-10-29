import type { TimelineItem } from '../domain/timeline'
import { Card } from '../components/ui/card'
import { formatTime } from './timeFormat'

export function UserBubble({ item }: { item: TimelineItem }) {
  const time = formatTime(item.createdAt)
  return (
    <Card className="ml-auto max-w-[85%] self-end rounded-md rounded-br-[2px] px-3 py-2 break-words">
      <div className="whitespace-pre-wrap">{item.promptText}</div>
      <div className="mt-1 flex justify-end gap-2 text-xs text-muted-foreground">
        <span>{item.targetName}</span>
        {time && <time>{time}</time>}
      </div>
    </Card>
  )
}
