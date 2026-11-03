import type { UsageMetric } from '../domain/usage'
import { metricRemaining } from '../domain/metricRemaining'
import { isResetPassed } from '../domain/usage-auth-state'
import { usageMetricTimeLabel } from '../domain/usage-metric-time'
import { metricPace } from '../domain/usagePace'
import { UsageGauge } from './UsageGauge'
import r from '../resources.json'

const ratio = (value: number | null, limit: number | null): number | null =>
  limit !== null && limit > 0 && value !== null ? (value / limit) * 100 : null

export function UsageMetricGauge({ provider = '', metric: m, limited, remaining = true }: {
  provider?: string; metric: UsageMetric; limited?: boolean; remaining?: boolean
}) {
  const left = metricRemaining(m)
  const used = m.unit === 'percent' ? m.used : ratio(m.used, m.limit)
  const shown = m.unit === 'percent' ? (remaining ? left : m.used) : ratio(remaining ? left : m.used, m.limit)
  const label = usageMetricTimeLabel(provider, m, r)
  return <UsageGauge used={used} shown={shown} label={remaining ? r.usageRemaining : r.usageUsed}
    window={m.id} limited={limited} stale={isResetPassed(m.resetsAt)} pace={metricPace(label, m, remaining)} />
}
