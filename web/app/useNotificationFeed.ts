import { useCallback } from 'react'
import type { PaneSummary, TimelineItem } from '../domain/timeline'
import { toNotification } from '../domain/notifications'
import { useNotificationStore } from './notificationStore'

export function useNotificationFeed(panes: PaneSummary[], pinned: string[]) {
  const add = useNotificationStore((s) => s.add)
  return useCallback(
    (item: TimelineItem) => {
      if (!pinned.includes(item.paneId)) return
      const name = panes.find((p) => p.paneId === item.paneId)?.name ?? item.targetName
      const n = toNotification(item, name)
      if (n) add(n)
    },
    [add, panes, pinned],
  )
}
