import type { PaneSummary, DisabledReason } from './timeline.js'
import { isBlocked, isUnknown, isDisabled } from './paneStateGuards.js'

export const isBusyReason = (r: DisabledReason) => r === 'agent_busy'

export function getPaneState(t?: PaneSummary) {
  if (!t) return { ok: false, reason: 'target_not_found' as const }
  if (isBlocked(t)) return { ok: false, reason: 'agent_blocked' as const }
  if (isUnknown(t)) return { ok: false, reason: 'agent_unknown' as const }
  if (isDisabled(t.disabledReason)) return { ok: false, reason: t.disabledReason }
  return { ok: true, reason: null }
}

export function canInputTarget(t?: PaneSummary): boolean {
  return Boolean(t && !isBlocked(t) && !isUnknown(t) && !isDisabled(t.disabledReason))
}

export function isQueuedTarget(t?: PaneSummary): boolean {
  return Boolean(t && !isBlocked(t) && (t.status === 'working' || t.disabledReason === 'agent_busy'))
}
