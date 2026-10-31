import { usePageTitle } from '../lib/usePageTitle'
import { TrustedIpPanel } from '../ui/TrustedIpPanel'
import { WorkspaceSection } from '../ui/WorkspaceSection'
import { PaneManageSection } from '../ui/PaneManageSection'

export function DashboardPage() {
  usePageTitle('Biseo Workspace')
  return (
    <>
      <TrustedIpPanel />
      <WorkspaceSection on={true} />
      <PaneManageSection />
    </>
  )
}
