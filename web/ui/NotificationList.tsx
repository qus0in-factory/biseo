import { useNotificationStore } from '../app/notificationStore'
import { NotificationRow } from './NotificationRow'
import { NotificationToolbar } from './NotificationToolbar'
import r from '../resources.json'

export function NotificationList() {
  const items = useNotificationStore((s) => s.items)
  const read = useNotificationStore((s) => s.read)
  const readAll = useNotificationStore((s) => s.readAll)
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{r.notifyEmpty}</p>
  return (
    <div className="flex flex-col gap-2">
      <NotificationToolbar items={items} onReadAll={readAll} />
      <ul className="flex flex-col">
        {items.map((item) => <NotificationRow key={item.id} item={item} onRead={() => read(item.id)} />)}
      </ul>
    </div>
  )
}
