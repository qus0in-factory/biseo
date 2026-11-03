import type { UsageMetric } from '../domain/usage'
import { usageMetricTimeLabel } from '../domain/usage-metric-time'
import { UsageTimeLeft } from './UsageTimeLeft'
import r from '../resources.json'

export function UsageMetricTimeLeft({ provider, metric: m, remaining }: {
  provider: string; metric: UsageMetric; remaining: boolean
}) {
  const label = usageMetricTimeLabel(provider, m, r)
  return label ? <UsageTimeLeft label={label} startsAt={m.startsAt} resetsAt={m.resetsAt} remaining={remaining} /> : null
}
