import type { DashboardProps } from './dashboardTypes'
import { PanesView } from './PanesView'
import { TimelineSection } from './TimelineSection'
import { DashboardHeader } from './DashboardHeader'
import { Card } from '../components/ui/card'
import r from '../resources.json'

export function DashboardView(p: DashboardProps) {
  const target = p.panes.find((x) => x.paneId === p.selectedId)
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[320px_1fr]">
      <DashboardHeader online={p.online ?? true} actions={p.headerActions} />
      <Card className="rounded-md bg-surface p-4">
        <h2>{r.panesTitle}</h2>
        <PanesView panes={p.panes} selectedId={p.selectedId} onSelect={p.onSelect} />
      </Card>
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
