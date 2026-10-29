import type { DashboardProps } from './dashboardTypes'
import { DesktopPaneDrawer } from './DesktopPaneDrawer'
import { TimelineSection } from './TimelineSection'

export function DesktopPanesGrid(p: DashboardProps) {
  const target = p.panes.find((x) => x.paneId === p.selectedId)
  return (
    <div className="flex min-w-0 flex-1 gap-4">
      <DesktopPaneDrawer
        panes={p.panes}
        selectedId={p.selectedId}
        onSelect={p.onSelect}
        online={p.online}
      />
      <div className="min-w-0 flex-1">
        <TimelineSection
          target={target}
          timeline={p.timeline}
          sending={p.sending}
          onSend={p.onSend}
          onCancel={p.onCancel}
        />
      </div>
    </div>
  )
}
