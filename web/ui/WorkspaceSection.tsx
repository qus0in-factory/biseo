import { useWorkspaceController } from '../app/useWorkspaceController'
import { workspaceApi as api } from '../infra/workspaceApi'
import { timelineStream as st } from '../infra/timelineStream'
import { DashboardView } from './DashboardView'

export function WorkspaceSection({ on }: { on: boolean }) {
  const { panes, sel, setSel, items, sending, send } = useWorkspaceController(
    api,
    st,
    on,
  )

  return (
    <DashboardView
      panes={panes}
      selectedId={sel}
      onSelect={setSel}
      timeline={items}
      sending={sending}
      onSend={send}
    />
  )
}
