import type { PaneSummary } from './timeline'

export interface AppConfig {
  workspaceId: string
}

export interface WorkspaceSummary {
  workspaceId: string
  id?: string
  label?: string | null
  focused?: boolean
  paneCount?: number
  number?: number
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
