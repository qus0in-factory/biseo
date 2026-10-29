export type TurnStatus =
  | 'queued'
  | 'working'
  | 'completed'
  | 'capture_unavailable'
  | 'blocked'
  | 'failed'
  | 'timeout'
  | 'cancelled'

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
  cancelError?: string | null
}
