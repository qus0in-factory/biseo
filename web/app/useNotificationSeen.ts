import { useEffect } from 'react'
import type { TimelineItem } from '../domain/timeline'
import { useNotificationStore } from './notificationStore'

export function useNotificationSeen(
  paneId: string | null,
  items: TimelineItem[],
  visible: boolean,
) {
  const dismissSeen = useNotificationStore((s) => s.dismissSeen)
  useEffect(() => {
    if (!visible || !paneId) return
    dismissSeen(paneId, items.map((i) => i.requestId))
  }, [paneId, items, visible, dismissSeen])
}
