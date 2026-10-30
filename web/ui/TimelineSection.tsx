import type { TimelineSectionProps } from './dashboardTypes'
import { TimelineView } from './TimelineView'
import { MessageComposer } from './MessageComposer'
import { TimelineHeader } from './TimelineHeader'

export function TimelineSection({ target, timeline, state, onRetry, sending, onSend, onCancel, online, onLoadOlder, olderLoaded }: TimelineSectionProps) {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <TimelineHeader />
      <div className="flex min-h-0 flex-1 flex-col border-b border-border">
        <TimelineView items={timeline} state={state} onRetry={onRetry} onCancel={onCancel} onLoadOlder={onLoadOlder} olderLoaded={olderLoaded} />
      </div>
      <MessageComposer target={target} busy={sending} onSend={onSend} online={online} timeline={timeline} />
    </section>
  )
}
