import type { DashboardProps } from './dashboardTypes'
import type { PaneSummary } from '../domain/timeline'
import { TimelineSection } from './TimelineSection'

type P = Pick<DashboardProps, 'timeline' | 'sending' | 'onSend' | 'onCancel'>
  & { target?: PaneSummary; online?: boolean }

export function WorkspaceMain({ target, timeline, sending, onSend, onCancel, online }: P) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <TimelineSection
        target={target}
        timeline={timeline}
        sending={sending}
        onSend={onSend}
        onCancel={onCancel}
        online={online}
      />
    </div>
  )
}
