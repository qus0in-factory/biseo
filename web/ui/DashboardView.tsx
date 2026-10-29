import type { DashboardProps } from './dashboardTypes'
import { PanesView } from './PanesView'
import { TimelineSection } from './TimelineSection'
import { ConnectionStatusBadge } from './ConnectionStatusBadge'
import r from '../resources.json'

export function DashboardView(p: DashboardProps) {
  const target = p.panes.find((x) => x.paneId === p.selectedId)
  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <ConnectionStatusBadge online={p.online ?? true} />
        {p.headerActions}
      </div>
      <aside className="panes-panel">
        <h2>{r.panesTitle}</h2>
        <PanesView panes={p.panes} selectedId={p.selectedId} onSelect={p.onSelect} />
      </aside>
      <TimelineSection
        target={target}
        timeline={p.timeline}
        sending={p.sending}
        onSend={p.onSend}
        onCancel={p.onCancel}
        online={p.online ?? true}
      />
    </div>
  )
}
