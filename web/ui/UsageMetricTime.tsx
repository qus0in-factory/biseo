import type { UsageMetric } from '../domain/usage'
import { showMetricReset } from '../domain/usage-ollama'
import { UsageWindowTime } from './UsageWindowTime'
import { formatZoned } from '../domain/formatZoned'
import r from '../resources.json'

export function UsageMetricTime({
  provider,
  metric,
}: {
  provider: string
  metric: UsageMetric
}) {
  if (!showMetricReset(provider, metric)) return null
  const d = {
    window: metric.id,
    usedPercent: metric.used,
    resetsAt: metric.resetsAt,
    checkedAt: null,
    limitReached: metric.unit === 'percent' && metric.used !== null && metric.used >= 100,
    source: null,
  }
  return <>
    {metric.startsAt && <span className="text-xs text-muted-foreground">{r.usagePeriodStart}: {formatZoned(metric.startsAt, 'Asia/Seoul')}</span>}
    <UsageWindowTime value={d} />
  </>
}
