import type { ProviderUsage, WindowUsage as W } from '../domain/usage-types.js'
import { windowsToMetrics as m } from '../domain/usage-metric-compat.js'
import { getFreeLock } from './opencode-free-lock.js'

export function evaluateFreeUsage(now = new Date()): ProviderUsage {
  const l = getFreeLock()
  if (!l) return { provider: 'opencode-free', state: 'unknown', metrics: [], windows: [] }
  const isPast = Boolean(l.isLocked && l.resetsAt && Date.parse(l.resetsAt) <= now.getTime())
  const lim = l.isLocked && !isPast
  const w: W = {
    window: 'primary',
    usedPercent: lim ? 100 : 0,
    resetsAt: l.resetsAt,
    checkedAt: l.checkedAt,
    limitReached: lim,
    source: isPast ? 'expected-unlocked' : l.source
  }
  return { provider: 'opencode-free', state: lim ? 'limited' : 'available', metrics: m([w]), windows: [w] }
}
