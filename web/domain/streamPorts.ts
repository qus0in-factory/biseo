import type { PaneSnapshot } from './portTypes'
import type { TimelineItem } from './timeline'

export type SseEvent =
  | { type: 'pane.updated'; data: PaneSnapshot }
  | { type: 'turn.updated'; data: TimelineItem }

export type SseEventHandler = (event: SseEvent) => void

export interface TimelineStreamPort {
  connect(
    workspaceId: string,
    onOpen: () => void,
    onEvent: SseEventHandler,
    onError: () => void,
  ): () => void
}
