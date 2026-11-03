import type { UsageMetric } from '../domain/usage'
import { usageMetricName } from '../domain/usage-metric-name'
import { UsageTimeLeft } from './UsageTimeLeft'
import r from '../resources.json'

export function UsageMetricTimeLeft({ provider, metric: m, remaining }: {
  provider: string; metric: UsageMetric; remaining: boolean
}) {
  const label = m.unit === 'percent' ? usageMetricName(provider, m.id, m.label, r)
    : provider === 'ollama' && m.id === 'included_balance' ? 'monthly' : null
  return label ? <UsageTimeLeft label={label} startsAt={m.startsAt} resetsAt={m.resetsAt} remaining={remaining} /> : null
}
