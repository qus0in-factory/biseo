import { PaneManagePaneItem } from './PaneManagePaneItem'
import type { usePaneManageState } from '../app/paneManageState'
import type { createPaneManageActions } from '../app/paneManageActions'
import { useUsageStore } from '../app/useUsageStore'
type P = {s: ReturnType<typeof usePaneManageState>; a: ReturnType<typeof createPaneManageActions>}
export function PaneManageList({s, a}: P) {
 const providers = useUsageStore((state) => state.providers)
 return <ul className="pane-manage-list">{s.panes.map(p => <PaneManagePaneItem key={p.paneId} p={p}
  providers={providers}
  busy={s.busy} confirmId={s.confirmId} renameId={s.renameId} renameName={s.renameName}
  setConfirmId={s.setConfirmId} setRenameId={s.setRenameId} setRenameName={s.setRenameName}
  onClose={a.close} onRename={a.rename}/>)}</ul>
}
