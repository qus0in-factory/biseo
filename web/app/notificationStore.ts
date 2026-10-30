import { create } from 'zustand'
import type { NotificationItem } from '../domain/notifications'
import { addNotification, readAllNotifications, readNotification } from '../domain/notificationList'

export interface NotificationState {
  items: NotificationItem[]
  add: (item: NotificationItem) => void
  read: (id: string) => void
  readAll: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: addNotification(s.items, item) })),
  read: (id) => set((s) => ({ items: readNotification(s.items, id) })),
  readAll: () => set((s) => ({ items: readAllNotifications(s.items) })),
}))
