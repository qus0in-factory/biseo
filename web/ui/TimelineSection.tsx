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
}

export function TimelineSection({ target, timeline, sending, onSend, onCancel, online }: P) {
  return (
    <section className="flex h-[calc(var(--visual-viewport-height,100dvh)-12rem)] min-h-[240px] flex-col">

      <h2>{r.timelineTitle}</h2>
      <TimelineView items={timeline} onCancel={onCancel} />
      <MessageComposer target={target} busy={sending} onSend={onSend} online={online} />
    </section>
  )
}
