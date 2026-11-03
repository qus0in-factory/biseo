import type { UsageMetric } from '../domain/usage'
import { showMetricReset } from '../domain/usage-ollama'
import { UsageWindowTime } from './UsageWindowTime'
import { formatZoned } from '../domain/formatZoned'
import { metricValueUnknown } from '../domain/usage-metric-format'
import { isResetPassed } from '../domain/usage-auth-state'
import r from '../resources.json'

export function UsageMetricTime({
  provider,
  metric: m,
  remaining = true,
}: {
  provider: string
  metric: UsageMetric
  remaining?: boolean
}) {
  if (!showMetricReset(provider, m)) return null
  const d = {
    window: m.id,
    usedPercent: m.used,
    resetsAt: m.resetsAt,
    checkedAt: null,
    limitReached: m.unit === 'percent' && m.used !== null && m.used >= 100,
    source: null,
  }
  const expected = isResetPassed(m.resetsAt) || metricValueUnknown(m, remaining)
  const start = m.startsAt ? formatZoned(m.startsAt, 'Asia/Seoul') : null
  return (
    <span className="flex flex-col items-end gap-0.5 text-xs leading-4 tabular-nums text-muted-foreground">
      {start && <span title={start}>{r.usagePeriodStart}: {start}</span>}
      <UsageWindowTime value={d} expected={expected} />
    </span>
  )
}
