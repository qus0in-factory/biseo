import type { WorkspaceApiPort } from '../domain/ports'
import { useWorkspacePicker } from './useWorkspacePicker'
import { WorkspacePickerView } from './WorkspacePickerView'

export interface WorkspacePickerProps { api: WorkspaceApiPort; onSelected?: (workspaceId: string) => void }

export function WorkspacePicker({ api, onSelected }: WorkspacePickerProps) {
  const s = useWorkspacePicker(api)
  const select = async (id: string) => {
    if (!api.selectWorkspace) return
    s.setLd(true); s.setErr(null)
    try {
      const cfg = await api.selectWorkspace(id)
      s.setCur(cfg.workspaceId); s.setNote(null); onSelected?.(cfg.workspaceId); await s.load()
    } catch { s.setErr('connection_unavailable') }
    finally { s.setLd(false) }
  }
  return <WorkspacePickerView workspaces={s.ws} current={s.cur} loading={s.ld} error={s.err} notice={s.note} onSelect={select} />
}
export default WorkspacePicker