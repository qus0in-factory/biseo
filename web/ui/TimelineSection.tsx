import type { PaneSummary, TimelineItem } from '../domain/timeline'
import { TimelineView } from './TimelineView'
import { MessageComposer } from './MessageComposer'
import r from '../resources.json'

export function TimelineSection({
  target,
  timeline,
  sending,
  onSend,
  onCancel,
}: {
  target?: PaneSummary
  timeline: TimelineItem[]
  sending: boolean
  onSend: (text: string) => void
  onCancel?: (id: string) => void
}) {
  return (
    <section className="flex h-[calc(100dvh-12rem)] min-h-[360px] flex-col">
      <h2>{r.timelineTitle}</h2>
      <TimelineView items={timeline} onCancel={onCancel} />
      <MessageComposer target={target} busy={sending} onSend={onSend} />
    </section>
  )
}
