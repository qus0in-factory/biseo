import type { DashboardProps } from './dashboardTypes'
import { PanesView } from './PanesView'
import { UsagePanel } from './UsagePanel'

type P = Pick<DashboardProps, 'panes' | 'selectedId' | 'onSelect' | 'online'> & { agentKind?: string | null }

export function PaneDrawerContent({ panes, selectedId, onSelect, online, agentKind }: P) {
  return (
    <>
      <UsagePanel enabled={online} agentKind={agentKind} />
      <PanesView panes={panes} selectedId={selectedId} onSelect={onSelect} />
    </>
  )
}
