import type { UsageMetric } from '../domain/usage'
import { usageMetricLabel } from '../domain/usage-metric-name'
import { formatMetricValue } from '../domain/usage-metric-format'
import { isBalanceMetric } from '../domain/usage-balance'
import r from '../resources.json'
export function usageMetricView(provider: string, metric: UsageMetric, remaining: boolean) {
  const showRemaining = remaining || isBalanceMetric(metric)
  return {
    label: usageMetricLabel(provider, metric.id, metric.label, r),
    showRemaining,
    text: formatMetricValue(metric, r.usageUnknownPercent, remaining),
    used: metric.unit === 'percent' ? metric.used : null,
    window: metric.id,
  }
}
