import { useNavigate } from 'react-router'
import type { NotificationItem } from '../domain/notifications'
import { useNotificationStore } from '../app/notificationStore'
import { Modal } from './Modal'
import { NotificationList } from './NotificationList'
import r from '../resources.json'

export function NotificationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const dismiss = useNotificationStore((s) => s.dismiss)
  const openItem = (item: NotificationItem) => {
    dismiss(item.id)
    onClose()
    navigate(`/chat/${item.paneId}`)
  }
  return (
    <Modal open={open} title={r.notifyTitle} onClose={onClose}>
      <NotificationList onOpen={openItem} />
    </Modal>
  )
}
