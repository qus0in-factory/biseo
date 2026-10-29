import type { DashboardProps } from './dashboardTypes'
import { DashboardHeader } from './DashboardHeader'
import { UsagePanel } from './UsagePanel'
import { MobileDrawer } from './MobileDrawer'
import { MobileDashboardBody } from './MobileDashboardBody'
import { DesktopDashboardBody } from './DesktopDashboardBody'
import { useUiStore } from '../app/uiStore'

export function DashboardView(props: DashboardProps) {
  const { online = true, headerActions } = props
  const activeTab = useUiStore((s) => s.activeTab)
  const target = props.panes.find((p) => p.paneId === props.selectedId)
  return (
    <div className="flex flex-col gap-4 w-full">
      <DashboardHeader online={online} actions={headerActions} />
      <div className={activeTab === 'panels' ? 'md:hidden' : ''}>
        <UsagePanel enabled={online} agentKind={target?.agentKind} />
      </div>
      <MobileDrawer online={online} />
      <MobileDashboardBody {...props} />
      <DesktopDashboardBody {...props} />
    </div>
  )
}