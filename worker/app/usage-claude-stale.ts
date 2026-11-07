import type { UsageSnapshot } from '../infra/d1-usage-types.js'
import { hasUsageValue } from './usage-stale-restore.js'

export function mergeClaudeStale(r: UsageSnapshot, existing: UsageSnapshot[]): UsageSnapshot[] {
  if (r.state !== 'unknown' || hasUsageValue(r)) return [r]
  const valid = existing.filter(e => e.provider === 'claude' && hasUsageValue(e) &&
    !!e.resetsAt && Date.parse(e.resetsAt) > Date.parse(r.updatedAt) &&
    (r.window === 'status' || e.window === r.window))
  return valid.length ? valid.map(e => ({
    ...e, state: 'unknown', reason: r.reason, retryAt: r.retryAt,
    source: 'claude-stale', updatedAt: r.updatedAt,
  })) : [r]
}
