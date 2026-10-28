export type PaneStatus = 'idle' | 'working' | 'blocked' | 'done' | 'unknown'
export type DisabledReason =
  | 'agent_busy'
  | 'agent_blocked'
  | 'agent_unknown'
  | 'no_agent_in_pane'
  | 'response_capture_unavailable'
  | 'target_not_found'
  | 'connection_unavailable'
  | null

export interface PaneSummary {
  paneId: string
  tabId?: string
  name: string
  agentKind?: string | null
  agentName?: string | null
  status: PaneStatus
  sendable: boolean
  disabledReason: DisabledReason
  revision?: number
}

export type TurnStatus =
  | 'queued'
  | 'working'
  | 'completed'
  | 'capture_unavailable'
  | 'blocked'
  | 'failed'
  | 'timeout'

export interface TimelineItem {
  requestId: string
  workspaceId: string
  paneId: string
  targetName: string
  agentKind?: string | null
  promptText: string
  status: TurnStatus
  responseText?: string | null
  errorCode?: string | null
  createdAt: string
  seq?: number
  completedAt?: string | null
}
