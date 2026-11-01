import { Modal } from './Modal'
import { PaneAddForm } from './PaneAddForm'
import r from '../resources.json'
export function PaneAddModal({open, onClose}: {open: boolean; onClose: () => void}) {
 return <Modal open={open} title={r.addPane} onClose={onClose} small>
  {open && <div className="settings-content"><PaneAddForm /></div>}
 </Modal>
}
