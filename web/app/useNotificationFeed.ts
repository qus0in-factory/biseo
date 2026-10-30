import { useCallback } from 'react'
import type { PaneSummary, TimelineItem } from '../domain/timeline'
import { toPinnedNotification } from '../domain/pinnedNotification'
import { useNotificationStore } from './notificationStore'

export function useNotificationFeed(
  panes: PaneSummary[],
  pinned: string[],
  selectedPaneId: string | null,
  visible: boolean,
) {
  const add = useNotificationStore((s) => s.add)
  return useCallback(
    (item: TimelineItem) => {
      const name = panes.find((p) => p.paneId === item.paneId)?.name ?? item.targetName
      const n = toPinnedNotification(item, name, pinned, {
        selectedPaneId,
        visibility: visible ? 'visible' : 'hidden',
      })
      if (n) add(n)
    },
    [add, panes, pinned, selectedPaneId, visible],
  )
}
