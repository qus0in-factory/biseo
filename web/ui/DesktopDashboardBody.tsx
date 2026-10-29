import type { DashboardProps } from './dashboardTypes'
import { DesktopSidebar } from './DesktopSidebar'
import { DesktopMainContent } from './DesktopMainContent'

export function DesktopDashboardBody(p: DashboardProps) {
  return (
    <div className="hidden md:flex gap-4 w-full">
      <DesktopSidebar />
      <DesktopMainContent {...p} />
    </div>
  )
}
