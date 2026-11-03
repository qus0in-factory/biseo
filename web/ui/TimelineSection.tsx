import type { TimelineSectionProps } from './dashboardTypes'
import { TimelineContents } from './TimelineContents'
import { MessageComposer } from './MessageComposer'
import { TimelineHeader } from './TimelineHeader'
import { RecentPullButton } from './RecentPullButton'
import { useTimelineReset } from './useTimelineReset'

export function TimelineSection({ target, timeline, state, onRetry, sending, onSend, onCancel, online, onLoadOlder, olderLoaded }: TimelineSectionProps) {
  const { pull, onReachBottom } = useTimelineReset(target, timeline, onCancel, onRetry)
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <TimelineHeader />
      {target&&<RecentPullButton pull={pull}/>}
      <div className="flex min-h-0 flex-1 flex-col border-b border-border">
        <TimelineContents target={target} timeline={timeline} state={state} onRetry={onRetry} onCancel={onCancel} onLoadOlder={onLoadOlder} olderLoaded={olderLoaded} onReachBottom={onReachBottom}/>
      </div>
      <MessageComposer target={target} busy={sending} onSend={onSend} online={online} timeline={timeline} />
    </section>
  )
}
