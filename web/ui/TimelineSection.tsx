import type { TimelineSectionProps } from './dashboardTypes'
import { TimelineContents } from './TimelineContents'
import { MessageComposer } from './MessageComposer'
import { TimelineHeader } from './TimelineHeader'
import { useTimelinePull } from './useTimelinePull'

export function TimelineSection({ target, timeline, state, onRetry, sending, onSend, onCancel, online, onLoadOlder, olderLoaded }: TimelineSectionProps) {
  const pull = useTimelinePull(target?.paneId ?? '', onRetry)
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <TimelineHeader />
      <div className="flex min-h-0 flex-1 flex-col border-b border-border">
        <TimelineContents target={target} timeline={timeline} state={state} onRetry={onRetry} onCancel={onCancel} onLoadOlder={onLoadOlder} olderLoaded={olderLoaded}/>
      </div>
      <MessageComposer target={target} busy={sending} onSend={onSend} online={online} timeline={timeline} pull={pull} />
    </section>
  )
}
