import { WorkspaceTabs } from './WorkspaceTabs'
import { WorkspaceSwitchingOverlay } from './WorkspaceSwitchingOverlay'
import { useWorkspaceSwitcherState } from './useWorkspaceSwitcherState'
import type { WorkspaceSelector } from './workspaceSelectionLink'

type P = { current: string | null; select?: WorkspaceSelector | null; switching?: boolean }

export function WorkspaceSwitcher({ current, select, switching }: P) {
 const { s, busy, target, choose, notice } = useWorkspaceSwitcherState(current, select, switching)
 return (
  <>
   <WorkspaceTabs state={s.state} current={current} notice={notice}
    busy={busy} target={target} onSelect={choose} onRetry={() => void s.load()}/>
   {busy && <WorkspaceSwitchingOverlay />}
  </>
 )
}