import type { DashboardProps } from './dashboardTypes'
import { DashboardHeader } from './DashboardHeader'
import { MobileDrawer } from './MobileDrawer'
import { MobileDashboardBody } from './MobileDashboardBody'
import { DesktopDashboardBody } from './DesktopDashboardBody'

export function DashboardView(props: DashboardProps) {
  const { online = true, headerActions } = props
  return (
    <div className="flex flex-col gap-4 w-full">
      <DashboardHeader online={online} actions={headerActions} />
      <MobileDrawer online={online} />
      <MobileDashboardBody {...props} />
      <DesktopDashboardBody {...props} />
    </div>
  )
}
