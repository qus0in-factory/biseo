import type { DashboardProps } from './dashboardTypes'
import { PanesView } from './PanesView'
import { TimelineSection } from './TimelineSection'
import { ConnectionStatusBadge } from './ConnectionStatusBadge'
import r from '../resources.json'

export function DashboardView({
  panes,
  selectedId,
  onSelect,
  timeline,
  sending,
  onSend,
  onCancel,
  online = true,
  headerActions,
}: DashboardProps) {
  const target = panes.find((p) => p.paneId === selectedId)
  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <ConnectionStatusBadge online={online} />
        {headerActions}
      </div>
      <aside className="panes-panel">
        <h2>{r.panesTitle}</h2>
        <PanesView panes={panes} selectedId={selectedId} onSelect={onSelect} />
      </aside>
      <TimelineSection
        target={target}
        timeline={timeline}
        sending={sending}
        onSend={onSend}
        onCancel={onCancel}
      />
    </div>
  )
}
