import type { NotificationItem } from '../domain/notifications'
import { NotificationRow } from './NotificationRow'
import { NotificationToolbar } from './NotificationToolbar'

export function NotificationBody({
  items,
  onRead,
  onReadAll,
}: {
  items: NotificationItem[]
  onRead: (id: string) => void
  onReadAll: () => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <NotificationToolbar items={items} onReadAll={onReadAll} />
      <ul className="flex flex-col">
        {items.map((item) => <NotificationRow key={item.id} item={item} onRead={() => onRead(item.id)} />)}
      </ul>
    </div>
  )
}
