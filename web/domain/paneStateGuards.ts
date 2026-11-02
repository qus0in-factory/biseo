import type { PaneSummary, DisabledReason } from './timeline.js'

export const isBlocked = (t?: PaneSummary) => t?.status === 'blocked' || t?.disabledReason === 'agent_blocked'
export const isUnknown = (t?: PaneSummary) => t?.status === 'unknown' || t?.disabledReason === 'agent_unknown'
export const isDisabled = (d?: DisabledReason) => !!d && d !== 'agent_busy'
