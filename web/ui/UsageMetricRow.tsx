import type { UsageMetric } from '../domain/usage'
import { UsageMetricValue } from './UsageMetricValue'
import { UsageMetricTime } from './UsageMetricTime'
import { OllamaAllowance } from './OllamaAllowance'
import { metricRemaining } from '../domain/metricRemaining'
import r from '../resources.json'

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
    <div className={`flex flex-col gap-0.5 border-t border-border/60 pt-1 ${limited ? 'text-error [&_.text-muted-foreground]:text-error' : ''}`}>
      {limited && <span className="sr-only">{r.usage_limited}</span>}
      <UsageMetricValue provider={provider} metric={metric} remaining={remaining} />
      <OllamaAllowance provider={provider} metric={metric} />
      <UsageMetricTime provider={provider} metric={metric} />
    </div>
  )
}
