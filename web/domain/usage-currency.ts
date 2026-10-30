import type { UsageMetric } from './usage'
import { metricRemaining } from './metricRemaining.js'

export function formatCurrency(m: UsageMetric, unk: string, show: boolean): string {
  const rem = metricRemaining(m)
  const v = show && rem !== null ? `$${rem}` : m.used !== null ? `$${m.used}` : unk
  if (m.used === null || m.limit === null || m.limit <= 0) return v
  const pct = Math.max(0, Math.min(100, Math.round((m.used / m.limit) * 100)))
  return `${v} (${pct}%)`
}
