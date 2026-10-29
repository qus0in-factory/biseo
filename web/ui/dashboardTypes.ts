import type { ReactNode } from 'react'
import type { PaneSummary as P, TimelineItem as T } from '../domain/timeline'

export interface DashboardProps {
  panes: P[]
  selectedId: string | null
  onSelect: (paneId: string) => void
  timeline: T[]
  sending: boolean
  onSend: (text: string) => void
  onCancel?: (id: string) => void
  online?: boolean
  headerActions?: ReactNode
}
