import type { DashboardProps } from './dashboardTypes'
import { DashboardHeader } from './DashboardHeader'
import { MobileDrawer } from './MobileDrawer'
import { DesktopPaneDrawer } from './DesktopPaneDrawer'
import { WorkspaceMain } from './WorkspaceMain'

export function DashboardView(props: DashboardProps) {
  const { online = true, headerActions } = props
  const target = props.panes.find((p) => p.paneId === props.selectedId)
  return (
    <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-4">
      <DashboardHeader online={online} actions={headerActions} />
      <MobileDrawer {...props} />
      <div className="flex min-h-0 min-w-0 flex-1 gap-4">
        <div className="hidden md:flex"><DesktopPaneDrawer {...props} /></div>
        <WorkspaceMain {...props} target={target} />
      </div>
    </div>
  )
}
