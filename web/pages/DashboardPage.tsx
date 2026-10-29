import { usePageTitle } from '../lib/usePageTitle'
import { WorkspaceSection } from '../ui/WorkspaceSection'

export function DashboardPage() {
  usePageTitle('Biseo Workspace')
  return <WorkspaceSection on={true} />
}
