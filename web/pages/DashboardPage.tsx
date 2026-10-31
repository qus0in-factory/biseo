import { usePageTitle } from '../lib/usePageTitle'
import { WorkspaceSection } from '../ui/WorkspaceSection'
import { PaneManageSection } from '../ui/PaneManageSection'

export function DashboardPage() {
  usePageTitle('Biseo Workspace')
  return (
    <>
      <WorkspaceSection on={true} />
      <PaneManageSection />
    </>
  )
}
