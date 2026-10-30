import { Modal } from './Modal'
import { UsagePanel } from './UsagePanel'
import r from '../resources.json'

export function UsageModal({ open, onClose, enabled = true }: { open: boolean; onClose: () => void; enabled?: boolean }) {
  return (
    <Modal open={open} title={r.usageTitle} onClose={onClose}>
      <UsagePanel enabled={enabled && open} />
    </Modal>
  )
}
