import type { PaneSummary, DisabledReason } from './timeline'

export function isBusyReason(r: DisabledReason): boolean {
  return r === 'agent_busy' || r === 'agent_blocked'
}

export function getPaneState(target?: PaneSummary) {
  if (!target) return { ok: false, reason: 'target_not_found' as const }
  if (target.sendable) return { ok: true, reason: null }
  return { ok: false, reason: target.disabledReason ?? 'agent_busy' }
}

export function canInputTarget(target?: PaneSummary): boolean {
  if (!target) return false
  if (target.sendable) return true
  return isBusyReason(target.disabledReason ?? null)
}

export function isQueuedTarget(target?: PaneSummary): boolean {
  if (!target || target.sendable) return false
  return isBusyReason(target.disabledReason ?? null)
}
