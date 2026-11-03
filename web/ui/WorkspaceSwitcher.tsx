import { useEffect } from 'react'
import { workspaceApi } from '../infra/workspaceApi'
import { WorkspaceTabs } from './WorkspaceTabs'
import { useUiStore } from '../app/uiStore'
import { useWorkspacePicker } from './useWorkspacePicker'
import { useWorkspaceSelectionPending } from './useWorkspaceSelectionPending'
import { useWorkspaceTabChoice } from './useWorkspaceTabChoice'
import { missingWorkspaceNotice } from './workspacePickerNotice'
import type { WorkspaceSelector } from './workspaceSelectionLink'

type P = { current: string | null; select?: WorkspaceSelector | null; switching?: boolean }

export function WorkspaceSwitcher({ current, select, switching }: P) {
 const s = useWorkspacePicker(workspaceApi)
 const setWorkspaceLabel = useUiStore((x) => x.setWorkspaceLabel)
 useEffect(() => {
  if (!current) { setWorkspaceLabel(null); return }
  setWorkspaceLabel(null)
  const found = s.ws.find((w) => (w.workspaceId ?? w.id ?? '') === current)
  setWorkspaceLabel(found?.label ?? null)
 }, [current, s.ws, setWorkspaceLabel])
 const pending = useWorkspaceSelectionPending()
 const { target, error, choose } = useWorkspaceTabChoice(workspaceApi, select, current, s)
 const notice = error ?? missingWorkspaceNotice(current, s.ws, s.ld, s.err)
 return <WorkspaceTabs state={s.state} current={current} notice={notice}
  busy={!!switching || pending} target={target} onSelect={choose} onRetry={() => void s.load()}/>
}
