import type { TimelineItem } from '../domain/timeline'
import { formatTime } from './timeFormat'

export function UserBubble({ item }: { item: TimelineItem }) {
  const time = formatTime(item.createdAt)
  return (
    <div className="chat-bubble chat-bubble-user">
      <div className="chat-content">{item.promptText}</div>
      <div className="chat-meta">
        <span className="chat-target">{item.targetName}</span>
        {time && <time className="chat-time">{time}</time>}
      </div>
    </div>
  )
}
