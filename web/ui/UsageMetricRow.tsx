import type { UsageMetric } from '../domain/usage'
import { UsageMetricValue } from './UsageMetricValue'
import { UsageMetricTime } from './UsageMetricTime'
import { OllamaAllowance } from './OllamaAllowance'

export function UsageMetricRow({
  provider,
  metric,
  remaining = true,
}: {
  provider: string
  metric: UsageMetric
  remaining?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5 border-t border-border/60 pt-1">
      <UsageMetricValue provider={provider} metric={metric} remaining={remaining} />
      <OllamaAllowance provider={provider} metric={metric} />
      <UsageMetricTime provider={provider} metric={metric} />
    </div>
  )
}
