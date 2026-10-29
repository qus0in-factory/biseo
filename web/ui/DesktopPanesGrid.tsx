import type { DashboardProps } from './dashboardTypes'
import { PanesView } from './PanesView'
import { TimelineSection } from './TimelineSection'
import { Card } from '../components/ui/card'
import r from '../resources.json'

export function DesktopPanesGrid(p: DashboardProps) {
  const target = p.panes.find((x) => x.paneId === p.selectedId)
  return (
    <div className="grid grid-cols-[280px_1fr] gap-4 flex-1">
      <Card className="rounded-md bg-surface p-4">
        <h2 className="text-base font-semibold mb-2">{r.panesTitle}</h2>
        <PanesView panes={p.panes} selectedId={p.selectedId} onSelect={p.onSelect} />
      </Card>
      <TimelineSection
        target={target}
        timeline={p.timeline}
        sending={p.sending}
        onSend={p.onSend}
        onCancel={p.onCancel}
      />
    </div>
  )
}
