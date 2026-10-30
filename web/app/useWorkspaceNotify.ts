import type { PaneSummary, TimelineItem } from '../domain/timeline'
import { useUiStore } from './uiStore'
import { useTabVisible } from './useTabVisible'
import { useNotificationFeed } from './useNotificationFeed'
import { useNotificationSeen } from './useNotificationSeen'

export function useWorkspaceNotify(
  paneId: string | null,
  items: TimelineItem[],
  panes: PaneSummary[],
) {
  const pinned = useUiStore((x) => x.pinned)
  const visible = useTabVisible()
  useNotificationSeen(paneId, items, visible)
  return useNotificationFeed(panes, pinned, paneId, visible)
}
