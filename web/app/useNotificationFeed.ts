import { useCallback } from 'react'
import type { PaneSummary, TimelineItem } from '../domain/timeline'
import { toPinnedNotification } from '../domain/pinnedNotification'
import { useNotificationStore } from './notificationStore'

export function useNotificationFeed(panes: PaneSummary[], pinned: string[]) {
  const add = useNotificationStore((s) => s.add)
  return useCallback(
    (item: TimelineItem) => {
      const name = panes.find((p) => p.paneId === item.paneId)?.name ?? item.targetName
      const n = toPinnedNotification(item, name, pinned)
      if (n) add(n)
    },
    [add, panes, pinned],
  )
}
