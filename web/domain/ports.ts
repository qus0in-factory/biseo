import type { PaneSummary, TimelineItem } from './timeline'

export interface AppConfig {
  workspaceId: string
}

export interface SendMessageInput {
  requestId: string
  workspaceId: string
  paneId: string
  text: string
}

export interface PaneSnapshot {
  workspaceId: string
  panes: PaneSummary[]
}

export interface WorkspaceApiPort {
  getConfig(): Promise<AppConfig>
  getPanes(workspaceId: string): Promise<PaneSummary[]>
  sendMessage(input: SendMessageInput): Promise<{ requestId: string }>
  getTurn(requestId: string): Promise<TimelineItem>
}

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
