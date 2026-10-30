import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { windowsToMetrics as m } from '../domain/usage-metric-compat.js'
import { getFreeLock } from './opencode-free-lock.js'
import { freePendingUsage } from './opencode-free-pending.js'

export function evaluateFreeUsage(now = new Date()): ProviderUsage {
  const l = getFreeLock()
  if (!l) return freePendingUsage(now)
  const isPast = Boolean(l.isLocked && l.resetsAt && Date.parse(l.resetsAt) <= now.getTime())
  const lim = l.isLocked && !isPast
  const src = isPast ? '해제 예상' : (lim ? '잠김' : '잠김 없음')
  const w: WindowUsage = { window: 'primary', usedPercent: lim ? 100 : 0, resetsAt: l.resetsAt, checkedAt: l.checkedAt, limitReached: lim, source: src }
  return { provider: 'opencode-free', state: lim ? 'limited' : 'available', metrics: m([w]), windows: [w], source: src, checkedAt: l.checkedAt }
}
