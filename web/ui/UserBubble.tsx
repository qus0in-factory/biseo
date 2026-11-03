import type { TimelineItem } from '../domain/timeline'
import { Card } from '../components/ui/card'
import { formatTime } from './timeFormat'
import { useTargetName } from './paneDirectory'

export function UserBubble({ item }: { item: TimelineItem }) {
  const time = formatTime(item.createdAt)
  const targetName = useTargetName(item)
  return (
    <Card className="ml-auto max-w-[85%] self-end rounded-2xl rounded-br-xs border-0 bg-muted/70 px-3.5 py-2.5 break-words shadow-none">
      <div className="whitespace-pre-wrap">{item.promptText}</div>
      <div className="mt-1 flex justify-end gap-2 text-xs text-muted-foreground">
        <span>{targetName}</span>
        {time && <time>{time}</time>}
      </div>
    </Card>
  )
}
