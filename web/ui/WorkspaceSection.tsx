import type { ReactNode } from 'react'
import { useOutletContext } from 'react-router'
import { useWorkspaceController } from '../app/useWorkspaceController'
import { workspaceApi as api } from '../infra/workspaceApi'
import { timelineStream as st } from '../infra/timelineStream'
import { DashboardView } from './DashboardView'
import type { AppOutletContext } from './AppContent'

export function WorkspaceSection({ on, headerActions }: { on: boolean; headerActions?: ReactNode }) {
  const ctx = useOutletContext<AppOutletContext | null>()
  const actions = headerActions ?? ctx?.headerActions
  const { panes, sel, setSel, items, sending, send, online } =
    useWorkspaceController(api, st, on)

  return (
    <DashboardView
      panes={panes}
      selectedId={sel}
      onSelect={setSel}
      timeline={items}
      sending={sending}
      onSend={send}
      online={online}
      headerActions={actions}
    />
  )
}
