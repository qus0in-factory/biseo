import type { DashboardProps } from './dashboardTypes'
import { MobileDrawer } from './MobileDrawer'
import { DesktopPaneDrawer } from './DesktopPaneDrawer'
import { WorkspaceMain } from './WorkspaceMain'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import { PaneDirectoryProvider } from './paneDirectory'
import './workspace-picker.css'
import './workspace-switcher.css'
import './workspace-tab.css'

export function DashboardView(props: DashboardProps) {
  const target = props.panes.find((p) => p.paneId === props.selectedId)
  return (
    <PaneDirectoryProvider panes={props.panes}>
      <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-4">
        <WorkspaceSwitcher current={props.workspaceId ?? null} select={props.onSelectWorkspace} switching={props.switching}/>
        <MobileDrawer {...props} />
        <div className="flex min-h-0 min-w-0 flex-1 gap-4">
          <div className="hidden min-h-0 md:flex"><DesktopPaneDrawer {...props} /></div>
          <WorkspaceMain {...props} target={target} />
        </div>
      </div>
    </PaneDirectoryProvider>
  )
}
