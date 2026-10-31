import { usePageTitle } from '../lib/usePageTitle'
import { WorkspaceSection } from '../ui/WorkspaceSection'
import r from '../resources.json'

export function DashboardPage() {
  usePageTitle(r.title)
  return (
    <>
      <WorkspaceSection on={true} />
    </>
  )
}
