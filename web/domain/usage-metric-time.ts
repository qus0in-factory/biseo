import type { UsageMetric } from './usage'
import { usageMetricName } from './usage-metric-name'

type L = Record<string, string>

export function usageMetricTimeLabel(provider: string, metric: UsageMetric, res: L): string | null {
  if (metric.unit === 'percent') return usageMetricName(provider, metric.id, metric.label, res)
  return provider === 'ollama' && metric.id === 'included_balance' ? 'monthly' : null
}
