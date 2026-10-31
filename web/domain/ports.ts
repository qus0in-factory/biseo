import type { AppConfig, PaneSnapshot, SendMessageInput, WorkspaceSummary } from './portTypes'
import type { PaneSummary, TimelineItem } from './timeline'
import type { TimelinePage, TimelineQuery } from './timelinePagingTypes'

export type { AppConfig, PaneSnapshot, SendMessageInput, WorkspaceSummary } from './portTypes'
export type { SseEvent, SseEventHandler, TimelineStreamPort } from './streamPorts'

export interface WorkspaceApiPort {
  getConfig(): Promise<AppConfig>
  getPanes(workspaceId: string): Promise<PaneSummary[]>
  listWorkspaces?(): Promise<WorkspaceSummary[]>
  selectWorkspace?(workspaceId: string): Promise<AppConfig>
  getTimeline?(workspaceId: string, query?: TimelineQuery): Promise<TimelinePage>
  sendMessage(input: SendMessageInput): Promise<{ requestId: string }>
  getTurn(requestId: string): Promise<TimelineItem>
  cancelTurn(requestId: string): Promise<void>
  openPane?(input: { templateId?: string; name?: string }): Promise<{ paneId: string }>
  closePane?(paneId: string): Promise<void>
  renamePane?(paneId: string, name: string): Promise<void>
}
