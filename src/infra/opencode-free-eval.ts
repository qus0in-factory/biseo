import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { getFreeLock } from './opencode-free-lock.js'

export function evaluateFreeUsage(now = new Date()): ProviderUsage {
  const l = getFreeLock()
  if (!l) return { provider: 'opencode-free', state: 'unknown', windows: [] }
  if (!l.isLocked) {
    const w: WindowUsage = { window: 'primary', usedPercent: 0, resetsAt: null, checkedAt: l.checkedAt, limitReached: false, source: l.source }
    return { provider: 'opencode-free', state: 'available', windows: [w] }
  }
  const isPast = Boolean(l.resetsAt && Date.parse(l.resetsAt) <= now.getTime())
  const w: WindowUsage = {
    window: 'primary',
    usedPercent: isPast ? 0 : 100,
    resetsAt: l.resetsAt,
    checkedAt: l.checkedAt,
    limitReached: !isPast,
    source: isPast ? 'expected-unlocked' : l.source
  }
  return { provider: 'opencode-free', state: isPast ? 'available' : 'limited', windows: [w] }
}
