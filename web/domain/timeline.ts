import type { Availability } from './availability'

export type {
  Availability,
  AvailabilityState,
  AvailabilityWindow,
} from './availability'
export type { TimelineItem, TurnStatus } from './timeline-item'

export type PaneStatus = 'idle' | 'working' | 'blocked' | 'done' | 'unknown'

export type BlockedReason =
  | 'usage_limited'
  | 'awaiting_input'
  | 'suspected_limit'
  | null

export type DisabledReason =
  | 'agent_busy'
  | 'agent_blocked'
  | 'agent_unknown'
  | 'no_agent_in_pane'
  | 'response_capture_unavailable'
  | 'provider_rate_limited'
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
  blockedReason?: BlockedReason
  revision?: number
  availability?: Availability
}
