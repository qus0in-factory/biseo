import type { ReactNode } from 'react'
import type { PaneSummary as P, TimelineItem as T } from '../domain/timeline'
import type { AsyncState } from '../domain/asyncState'
import type { ConnectionStatus } from '../domain/connectionStatus'
import type { WorkspaceSelector } from './workspaceSelectionLink'

export interface DashboardProps {
  panes: P[]
  panesState?: AsyncState<P[]>
  panesRetry?: () => void
  selectedId: string | null
  onSelect: (paneId: string) => void
  timeline: T[]
  timelineState?: AsyncState<T[]>
  retryTimeline?: () => void
  sending: boolean
  onSend: (text: string) => void
  onCancel?: (id: string) => void | Promise<void>
  online?: boolean
  connection?: ConnectionStatus
  onLoadOlder?: () => void
  olderLoaded?: number
  headerActions?: ReactNode
  workspaceId?: string | null
  onSelectWorkspace?: WorkspaceSelector
  switching?: boolean
}

export interface TimelineSectionProps {
  target?: P
  timeline: T[]
  state?: AsyncState<T[]>
  onRetry?: () => void
  sending: boolean
  onSend: (text: string) => void
  onCancel?: (id: string) => void | Promise<void>
  online?: boolean
  onLoadOlder?: () => void
  olderLoaded?: number
  onReachBottom?: () => void
}
