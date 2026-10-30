import { create } from 'zustand'
import type { NotificationItem } from '../domain/notifications'
import {
  addNotification,
  readAllNotifications,
  readNotification,
  removeNotification,
  removeSeenNotifications,
} from '../domain/notificationList'

export interface NotificationState {
  items: NotificationItem[]
  add: (item: NotificationItem) => void
  read: (id: string) => void
  readAll: () => void
  dismiss: (id: string) => void
  dismissSeen: (paneId: string, ids: string[]) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: addNotification(s.items, item) })),
  read: (id) => set((s) => ({ items: readNotification(s.items, id) })),
  readAll: () => set((s) => ({ items: readAllNotifications(s.items) })),
  dismiss: (id) => set((s) => ({ items: removeNotification(s.items, id) })),
  dismissSeen: (paneId, ids) => set((s) => ({ items: removeSeenNotifications(s.items, paneId, ids) })),
}))
