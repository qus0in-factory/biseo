import type { AppConfig, PaneSnapshot, SendMessageInput } from './portTypes'
import type { PaneSummary, TimelineItem } from './timeline'
import type { TimelinePage, TimelineQuery } from './timelinePagingTypes'

export type { AppConfig, PaneSnapshot, SendMessageInput } from './portTypes'
export type { SseEvent, SseEventHandler, TimelineStreamPort } from './streamPorts'

export interface WorkspaceApiPort {
  getConfig(): Promise<AppConfig>
  getPanes(workspaceId: string): Promise<PaneSummary[]>
  getTimeline?(workspaceId: string, query?: TimelineQuery): Promise<TimelinePage>
  sendMessage(input: SendMessageInput): Promise<{ requestId: string }>
  getTurn(requestId: string): Promise<TimelineItem>
  cancelTurn(requestId: string): Promise<void>
}
