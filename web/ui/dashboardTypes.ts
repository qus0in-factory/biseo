import type { ReactNode } from 'react'
import type { PaneSummary as P, TimelineItem as T } from '../domain/timeline'
import type { AsyncState } from '../domain/asyncState'

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
  onCancel?: (id: string) => void
  online?: boolean
  onLoadOlder?: () => void
  olderLoaded?: number
  headerActions?: ReactNode
}

export interface TimelineSectionProps {
  target?: P
  timeline: T[]
  state?: AsyncState<T[]>
  onRetry?: () => void
  sending: boolean
  onSend: (text: string) => void
  onCancel?: (id: string) => void
  online?: boolean
  onLoadOlder?: () => void
  olderLoaded?: number
}
