import type { UsageMetric } from './usage'

export function formatMetricValue(m: UsageMetric, unk = '알 수 없음'): string {
  if (m.unit === 'percent') return m.used !== null ? `${m.used}%` : unk
  if (m.unit === 'credits') return m.remaining !== null ? `${m.remaining} credits` : (m.used !== null ? `${m.used} used` : unk)
  if (m.unit === 'currency') return m.remaining !== null ? `$${m.remaining}` : (m.used !== null ? `$${m.used}` : unk)
  if (m.unit === 'tokens') return m.used !== null ? `${m.used} tokens` : unk
  if (m.unit === 'requests') return m.used !== null ? `${m.used} reqs` : unk
  return m.used !== null ? `${m.used} ${m.unit}` : unk
}
