import type { PaneSummary, TimelineItem } from '../domain/timeline'
import { TimelineView } from './TimelineView'
import { MessageComposer } from './MessageComposer'
import r from '../resources.json'

type P = {
  target?: PaneSummary
  timeline: TimelineItem[]
  sending: boolean
  onSend: (text: string) => void
  onCancel?: (id: string) => void
  online?: boolean
  onLoadOlder?: () => void
  olderLoaded?: number
}

export function TimelineSection({ target, timeline, sending, onSend, onCancel, online, onLoadOlder, olderLoaded }: P) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <h2>{r.timelineTitle}</h2>
      <div className="flex min-h-0 flex-1 flex-col border-b border-border">
        <TimelineView items={timeline} onCancel={onCancel} onLoadOlder={onLoadOlder} olderLoaded={olderLoaded} />
      </div>
      <MessageComposer target={target} busy={sending} onSend={onSend} online={online} timeline={timeline} />
    </section>
  )
}
