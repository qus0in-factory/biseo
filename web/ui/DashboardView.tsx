import type { DashboardProps } from './dashboardTypes'
import { PanesView } from './PanesView'
import { TimelineSection } from './TimelineSection'
import { DashboardHeader } from './DashboardHeader'
import { Card } from '../components/ui/card'
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[320px_1fr]">
      <DashboardHeader online={online} actions={headerActions} />
      <Card className="rounded-md bg-surface p-4">
        <h2>{r.panesTitle}</h2>
        <PanesView panes={panes} selectedId={selectedId} onSelect={onSelect} />
      </Card>
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
