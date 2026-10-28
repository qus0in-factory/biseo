import type { PaneSummary as P, TimelineItem as T } from '../domain/timeline'
import { PanesView } from './PanesView'
import { TimelineView } from './TimelineView'
import { MessageComposer } from './MessageComposer'
import r from '../resources.json'

export function DashboardView({
  panes,
  selectedId,
  onSelect,
  timeline,
  sending,
  onSend,
}: {
  panes: P[]
  selectedId: string | null
  onSelect: (paneId: string) => void
  timeline: T[]
  sending: boolean
  onSend: (text: string) => void
}) {
  const target = panes.find((p) => p.paneId === selectedId)
  return (
    <div className="dashboard-layout">
      <aside className="panes-panel">
        <h2>{r.panesTitle}</h2>
        <PanesView panes={panes} selectedId={selectedId} onSelect={onSelect} />
      </aside>
      <section className="timeline-panel">
        <h2>{r.timelineTitle}</h2>
        <TimelineView items={timeline} />
        <MessageComposer target={target} busy={sending} onSend={onSend} />
      </section>
    </div>
  )
}
