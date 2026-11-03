import { useWorkspacePicker } from './useWorkspacePicker'
import { useWorkspaceSelectionPending } from './useWorkspaceSelectionPending'
import { useWorkspaceTabChoice } from './useWorkspaceTabChoice'
import { useWorkspaceLabelSync } from '../app/useWorkspaceLabelSync'
import { missingWorkspaceNotice } from './workspacePickerNotice'
import { workspaceApi } from '../infra/workspaceApi'
import type { WorkspaceSelector } from './workspaceSelectionLink'

export function useWorkspaceSwitcherState(
 current: string | null, select: WorkspaceSelector | null | undefined, switching: boolean | undefined,
) {
 const s = useWorkspacePicker(workspaceApi)
 useWorkspaceLabelSync(current, s.ws)
 const pending = useWorkspaceSelectionPending()
 const { target, error, choose } = useWorkspaceTabChoice(workspaceApi, select, current, s)
 const notice = error ?? missingWorkspaceNotice(current, s.ws, s.ld, s.err)
 const busy = !!switching || pending
 return { s, busy, target, choose, notice }
}