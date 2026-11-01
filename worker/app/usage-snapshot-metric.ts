import type { UsageMetric, UsageSnapshot } from '../infra/d1-usage-types.js'

export function snapshotMetric(r: UsageSnapshot): UsageMetric {
  const percent = (r.unit ?? 'percent') === 'percent'
  return {
    id: r.metricId ?? r.window, label: r.label ?? r.metricId ?? r.window,
    unit: r.unit ?? 'percent', used: r.used ?? r.usedPercent,
    limit: r.limitValue ?? (percent ? 100 : null),
    remaining: r.remaining ?? (percent && r.usedPercent !== null ? Math.max(0, 100 - r.usedPercent) : null),
    resetsAt: r.resetsAt, startsAt: r.startsAt
  }
}
