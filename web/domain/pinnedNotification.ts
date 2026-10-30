import type { TimelineItem } from './timeline'
import type { NotificationItem } from './notifications'
import { toNotification } from './notifications'

export type NotifyContext = {
  selectedPaneId?: string | null
  visibility?: string | null
}

export const isPinnedPane = (paneId: string, pinned: string[]) => pinned.includes(paneId)

export const toPinnedNotification = (
  item: TimelineItem,
  paneName: string,
  pinned: string[],
  ctx: NotifyContext = {},
): NotificationItem | null => {
  if (!isPinnedPane(item.paneId, pinned)) return null
  if (ctx.selectedPaneId === item.paneId && ctx.visibility === 'visible') return null
  return toNotification(item, paneName)
}
