import type { DashboardProps } from './dashboardTypes'
import { DesktopPanesGrid } from './DesktopPanesGrid'
import { TimelineSection } from './TimelineSection'
import { HistoryView } from './HistoryView'
import { useUiStore } from '../app/uiStore'

export function DesktopMainContent(p: DashboardProps) {
  const { activeTab } = useUiStore()
  const target = p.panes.find((x) => x.paneId === p.selectedId)

  if (activeTab === 'history') return <div className="flex-1"><HistoryView /></div>
  if (activeTab === 'chat') {
    return (
      <div className="flex-1">
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
  return <DesktopPanesGrid {...p} />
}
