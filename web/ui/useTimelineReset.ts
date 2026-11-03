import type { PaneSummary, TimelineItem } from '../domain/timeline'
import { useTimelinePull } from './useTimelinePull'
import { useScrollReset } from './useScrollReset'

export function useTimelineReset(
  target: PaneSummary | undefined,
  items: TimelineItem[],
  onCancel: ((id: string) => void | Promise<void>) | undefined,
  onImported?: () => void,
) {
  const pull = useTimelinePull(target?.paneId ?? '', onImported)
  const onReachBottom = useScrollReset(target ? items : [], onCancel, pull)
  return { pull, onReachBottom }
}
