import type { UsageMetric } from './usage'

export function metricRemaining(m: UsageMetric): number | null {
  if (m.remaining !== null) return m.remaining
  if (m.limit !== null && m.used !== null) return m.limit - m.used
  return null
}

export function formatMetricValue(m: UsageMetric, unk = '알 수 없음', showRemaining?: boolean): string {
  const show = showRemaining ?? (m.unit !== 'percent')
  const rem = metricRemaining(m)
  if (m.unit === 'percent') {
    if (show && m.limit !== null && m.used !== null) return `${Math.max(0, m.limit - m.used)}%`
    return m.used !== null ? `${m.used}%` : unk
  }
  if (m.unit === 'credits') {
    if (show && rem !== null) return `${rem} credits`
    return m.used !== null ? `${m.used} used` : unk
  }
  if (m.unit === 'currency') {
    if (show && rem !== null) return `$${rem}`
    return m.used !== null ? `$${m.used}` : unk
  }
  if (m.unit === 'tokens') return m.used !== null ? `${m.used} tokens` : unk
  if (m.unit === 'requests') return m.used !== null ? `${m.used} reqs` : unk
  return m.used !== null ? `${m.used} ${m.unit}` : unk
}
