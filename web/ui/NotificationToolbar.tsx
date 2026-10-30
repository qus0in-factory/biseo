import type { NotificationItem } from '../domain/notifications'
import { unreadCount } from '../domain/notificationList'
import { Button } from '../components/ui/button'
import r from '../resources.json'

type P = { items: NotificationItem[]; onReadAll: () => void }

export function NotificationToolbar({ items, onReadAll }: P) {
  const unread = unreadCount(items)
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{r.notifyUnread.replace('{n}', String(unread))}</span>
      <Button type="button" variant="ghost" onClick={onReadAll} disabled={unread === 0}>{r.notifyReadAll}</Button>
    </div>
  )
}
