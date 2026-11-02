import type { PaneSummary as P, DisabledReason as D } from './timeline.js'

const blk = (t?: P) => t?.status === 'blocked' || t?.disabledReason === 'agent_blocked'
const unk = (t?: P) => t?.status === 'unknown' || t?.disabledReason === 'agent_unknown'
const dis = (d?: D) => !!d && d !== 'agent_busy'

export const isBusyReason = (r: D) => r === 'agent_busy'

export function getPaneState(t?: P) {
  if (!t) return { ok: false, reason: 'target_not_found' as const }
  if (blk(t)) return { ok: false, reason: 'agent_blocked' as const }
  if (unk(t)) return { ok: false, reason: 'agent_unknown' as const }
  if (dis(t.disabledReason)) return { ok: false, reason: t.disabledReason }
  return { ok: true, reason: null }
}

export function canInputTarget(t?: P): boolean {
  return Boolean(t && !blk(t) && !unk(t) && !dis(t.disabledReason))
}

export function isQueuedTarget(t?: P): boolean {
  return Boolean(t && !blk(t) && (t.status === 'working' || t.disabledReason === 'agent_busy'))
}
