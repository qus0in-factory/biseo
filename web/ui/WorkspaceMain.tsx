import type { DashboardProps } from './dashboardTypes'
import type { PaneSummary } from '../domain/timeline'
import { TimelineSection } from './TimelineSection'

type P = Pick<DashboardProps, 'timeline' | 'timelineState' | 'retryTimeline' | 'sending' | 'onSend' | 'onCancel' | 'onLoadOlder' | 'olderLoaded'>
  & { target?: PaneSummary; online?: boolean }

export function WorkspaceMain({ target, timeline, timelineState, retryTimeline, sending, onSend, onCancel, online, onLoadOlder, olderLoaded }: P) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <TimelineSection
        target={target}
        timeline={timeline}
        state={timelineState}
        onRetry={retryTimeline}
        sending={sending}
        onSend={onSend}
        onCancel={onCancel}
        online={online}
        onLoadOlder={onLoadOlder}
        olderLoaded={olderLoaded}
      />
    </div>
  )
}
