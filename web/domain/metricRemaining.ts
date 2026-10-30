import type { UsageMetric } from './usage'
export function metricRemaining(m: UsageMetric): number | null {
  if (m.remaining !== null) return m.remaining
  if (m.limit !== null && m.used !== null) return m.limit - m.used
  return null
}