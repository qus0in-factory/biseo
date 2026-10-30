import { Modal } from './Modal'
import { NotificationList } from './NotificationList'
import r from '../resources.json'

export function NotificationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} title={r.notifyTitle} onClose={onClose}>
      <NotificationList />
    </Modal>
  )
}
