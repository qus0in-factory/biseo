import type { UsageMetric } from '../domain/usage'
import { UsageMetricValue } from './UsageMetricValue'
import { UsageMetricTime } from './UsageMetricTime'
import { metricLimited } from '../domain/usage-limit-state'

export function UsageMetricRow({
  provider,
  metric,
  remaining = true,
  limitReached = false,
}: {
  provider: string
  metric: UsageMetric
  remaining?: boolean
  limitReached?: boolean
}) {
  const limited = metricLimited(metric, limitReached)
  return (
    <div className="flex min-w-0 flex-col gap-1 py-1.5">
      <UsageMetricValue provider={provider} metric={metric} remaining={remaining} limited={limited} />
      <UsageMetricTime provider={provider} metric={metric} remaining={remaining} />
    </div>
  )
}
