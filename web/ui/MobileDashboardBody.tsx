import type { DashboardProps } from './dashboardTypes'
import { Tabs } from '../components/ui/tabs'
import { MobileTabsBar } from './MobileTabsBar'
import { MobileTabsContent } from './MobileTabsContent'
import { useUiStore } from '../app/uiStore'

export function MobileDashboardBody(p: DashboardProps) {
  const { activeTab, setActiveTab } = useUiStore()
  return (
    <div className="flex md:hidden flex-col w-full">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <MobileTabsBar />
        <MobileTabsContent {...p} />
      </Tabs>
    </div>
  )
}
