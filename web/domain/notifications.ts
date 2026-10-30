import type { TimelineItem, TurnStatus } from './timeline'

export interface NotificationItem {
  id: string
  paneId: string
  paneName: string
  status: TurnStatus
  text: string
  createdAt: string
  read: boolean
}

const NOTIFIABLE: TurnStatus[] = ['completed', 'blocked', 'failed', 'timeout', 'capture_unavailable']

export const notifiable = (status: TurnStatus) => NOTIFIABLE.includes(status)

export const toNotification = (item: TimelineItem, paneName: string): NotificationItem | null =>
  notifiable(item.status)
    ? {
        id: item.requestId,
        paneId: item.paneId,
        paneName,
        status: item.status,
        text: (item.responseText ?? '').trim().slice(0, 200),
        createdAt: item.completedAt ?? item.createdAt,
        read: false,
      }
    : null
