import { workspaceApi } from '../infra/workspaceApi'
import { WorkspaceTabs } from './WorkspaceTabs'
import { useWorkspacePicker } from './useWorkspacePicker'
import { useWorkspaceSelectionPending } from './useWorkspaceSelectionPending'
import { useWorkspaceTabChoice } from './useWorkspaceTabChoice'
import { missingWorkspaceNotice } from './workspacePickerNotice'
import type { WorkspaceSelector } from './workspaceSelectionLink'

type P = { current: string | null; select?: WorkspaceSelector | null; switching?: boolean }

export function WorkspaceSwitcher({ current, select, switching }: P) {
 const s = useWorkspacePicker(workspaceApi)
 const pending = useWorkspaceSelectionPending()
 const { target, error, choose } = useWorkspaceTabChoice(workspaceApi, select, current, s)
 const notice = error ?? missingWorkspaceNotice(current, s.ws, s.ld, s.err)
 return <WorkspaceTabs state={s.state} current={current} notice={notice}
  busy={!!switching || pending} target={target} onSelect={choose} onRetry={() => void s.load()}/>
}
