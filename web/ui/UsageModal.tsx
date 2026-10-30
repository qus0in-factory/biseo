import { Modal } from './Modal'
import { UsageModalBody } from './UsageModalBody'
import r from '../resources.json'
const res = r as any
export function UsageModal({ open, onClose, enabled = true }: { open: boolean; onClose: () => void; enabled?: boolean }) {
  return (<Modal open={open} title={res.usageTitle} onClose={onClose}><UsageModalBody enabled={enabled && open} /></Modal>)
}