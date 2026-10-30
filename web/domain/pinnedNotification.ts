import type { TimelineItem } from './timeline'
import type { NotificationItem } from './notifications'
import { toNotification } from './notifications'

export const isPinnedPane = (paneId: string, pinned: string[]) => pinned.includes(paneId)

export const toPinnedNotification = (
  item: TimelineItem,
  paneName: string,
  pinned: string[],
): NotificationItem | null => (isPinnedPane(item.paneId, pinned) ? toNotification(item, paneName) : null)