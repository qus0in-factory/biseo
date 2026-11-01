import type { PaneSummary, TimelineItem } from './timeline'

type Item = Pick<TimelineItem, 'paneId' | 'targetName'>
type Pane = Pick<PaneSummary, 'paneId' | 'name'>

export function resolveTargetName(item: Item, panes: readonly Pane[]): string {
  if (item.targetName && item.targetName !== item.paneId) return item.targetName
  return panes.find((pane) => pane.paneId === item.paneId)?.name ?? item.targetName
}
