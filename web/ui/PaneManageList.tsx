import { PaneManagePaneItem } from './PaneManagePaneItem'
import type { usePaneManageState } from '../app/paneManageState'
import type { createPaneManageActions } from '../app/paneManageActions'
type P = {s: ReturnType<typeof usePaneManageState>; a: ReturnType<typeof createPaneManageActions>}
export function PaneManageList({s, a}: P) {
 return <ul>{s.panes.map(p => <PaneManagePaneItem key={p.paneId} p={p}
  busy={s.busy} confirmId={s.confirmId} renameId={s.renameId} renameName={s.renameName}
  setConfirmId={s.setConfirmId} setRenameId={s.setRenameId} setRenameName={s.setRenameName}
  onClose={a.close} onRename={a.rename}/>)}</ul>
}
