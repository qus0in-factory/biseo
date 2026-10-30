import type { NotificationItem } from './notifications'

export const addNotification = (list: NotificationItem[], next: NotificationItem, max = 30) =>
  [next, ...list.filter((item) => item.id !== next.id)].slice(0, max)

export const unreadCount = (list: NotificationItem[]) => list.filter((item) => !item.read).length

export const readNotification = (list: NotificationItem[], id: string) =>
  list.map((item) => (item.id === id ? { ...item, read: true } : item))

export const readAllNotifications = (list: NotificationItem[]) =>
  list.map((item) => (item.read ? item : { ...item, read: true }))

export const removeNotification = (list: NotificationItem[], id: string) =>
  list.filter((item) => item.id !== id)

export const removeSeenNotifications = (
  list: NotificationItem[],
  paneId: string,
  seenIds: string[],
) => {
  const seen = new Set(seenIds)
  return list.filter((item) => !(item.paneId === paneId && seen.has(item.id)))
}
