import type { UsageMetric } from '../domain/usage'
import { formatMetricValue } from '../domain/usage-metric-format'
import { UsageWindowTime } from './UsageWindowTime'

export function UsageMetricRow({ metric, remaining = true }: { metric: UsageMetric; remaining?: boolean }) {
  const dummyWindow = {
    window: metric.id,
    usedPercent: metric.used,
    resetsAt: metric.resetsAt,
    checkedAt: null,
    limitReached: metric.unit === 'percent' && metric.used !== null && metric.used >= 100,
    source: null
  }
  return (
    <div className="flex flex-col gap-0.5 border-t border-border/60 pt-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{metric.label}</span>
        <span className="font-mono text-xs">{formatMetricValue(metric, '알 수 없음', remaining)}</span>
      </div>
      <UsageWindowTime value={dummyWindow} />
    </div>
  )
}
