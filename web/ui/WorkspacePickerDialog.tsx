import { Modal } from './Modal'
import { WorkspacePicker } from './WorkspacePicker'
import { workspaceApi } from '../infra/workspaceApi'
import type { WorkspaceSelector } from './workspaceSelectionLink'
import r from '../resources.json'

type P = { open: boolean; onClose: () => void; current: string | null; select?: WorkspaceSelector | null }

export function WorkspacePickerDialog({ open, onClose, current, select }: P) {
 return <Modal open={open} title={r.workspaceSwitchTitle} onClose={onClose} small>
  <p className="workspace-switcher-hint">{r.workspaceSwitchHint}</p>
  <WorkspacePicker api={workspaceApi} current={current} selector={select} onSelected={onClose}/>
 </Modal>
}
