import type { UsageMetric } from '../domain/usage'
import { metricRemaining } from '../domain/metricRemaining'
import { isResetPassed } from '../domain/usage-auth-state'
import { UsageGauge } from './UsageGauge'
import r from '../resources.json'

const ratio = (value: number | null, limit: number | null): number | null =>
  limit !== null && limit > 0 && value !== null ? (value / limit) * 100 : null

export function UsageMetricGauge({ metric: m, limited, remaining = true }: {
  metric: UsageMetric; limited?: boolean; remaining?: boolean
}) {
  const left = metricRemaining(m)
  const used = m.unit === 'percent' ? m.used : ratio(m.used, m.limit)
  const shown = m.unit === 'percent' ? (remaining ? left : m.used) : ratio(remaining ? left : m.used, m.limit)
  return <UsageGauge used={used} shown={shown} label={remaining ? r.usageRemaining : r.usageUsed}
    window={m.id} limited={limited} stale={isResetPassed(m.resetsAt)} />
}
