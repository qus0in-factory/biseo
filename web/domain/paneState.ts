import type { PaneSummary } from '../domain/timeline'

export function getPaneState(target?: PaneSummary) {
  if (!target) return { ok: false, reason: 'target_not_found' as const }
  if (target.sendable) return { ok: true, reason: null }
  return { ok: false, reason: target.disabledReason ?? 'agent_busy' }
}
