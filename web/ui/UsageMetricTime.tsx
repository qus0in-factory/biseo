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
  const start = metric.startsAt ? formatZoned(metric.startsAt, 'Asia/Seoul') : null
  return (
    <span className="flex flex-col items-end gap-0.5 text-[11px] leading-4 tabular-nums text-muted-foreground">
      {start && <span title={start}>{r.usagePeriodStart}: {start}</span>}
      <UsageWindowTime value={d} />
    </span>
  )
}
