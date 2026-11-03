import type { UsageMetric } from '../domain/usage'
import { metricRemaining } from '../domain/metricRemaining'
import { isResetPassed } from '../domain/usage-auth-state'
import { UsageGauge } from './UsageGauge'

export function UsageMetricGauge({ metric: m, limited }: { metric: UsageMetric; limited?: boolean }) {
  const left = metricRemaining(m)
  const used = m.unit === 'percent' ? m.used : m.limit !== null && m.limit > 0
    ? ((m.used ?? (left !== null ? m.limit - left : NaN)) / m.limit) * 100 : null
  return <UsageGauge used={used} window={m.id} limited={limited} stale={isResetPassed(m.resetsAt)} />
}
