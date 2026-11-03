import type { UsageMetric } from '../domain/usage'
import { UsageMetricValue } from './UsageMetricValue'
import { UsageMetricTime } from './UsageMetricTime'
import { OllamaAllowance } from './OllamaAllowance'
import { metricRemaining } from '../domain/metricRemaining'

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
  const left = metricRemaining(metric)
  const limited = limitReached || (left !== null && left <= 0) ||
    (metric.used !== null && metric.limit !== null && metric.used >= metric.limit)
  return (
    <div className="flex min-w-0 flex-col gap-1 py-1.5">
      <UsageMetricValue provider={provider} metric={metric} remaining={remaining} limited={limited} />
      <OllamaAllowance provider={provider} metric={metric} />
      <UsageMetricTime provider={provider} metric={metric} />
    </div>
  )
}
