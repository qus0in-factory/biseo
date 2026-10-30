import type { NotificationItem } from '../domain/notifications'
import { NotificationRow } from './NotificationRow'
import { NotificationToolbar } from './NotificationToolbar'

export function NotificationBody({
  items,
  onOpen,
  onReadAll,
}: {
  items: NotificationItem[]
  onOpen: (item: NotificationItem) => void
  onReadAll: () => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <NotificationToolbar items={items} onReadAll={onReadAll} />
      <ul className="flex flex-col">
        {items.map((item) => <NotificationRow key={item.id} item={item} onOpen={() => onOpen(item)} />)}
      </ul>
    </div>
  )
}
