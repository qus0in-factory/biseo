import type { UsageMetric } from './usage'

const BALANCES = ['included_balance', 'purchased_balance']

export const visibleOllamaMetric = (m: UsageMetric): boolean => BALANCES.includes(m.id)

export const selectCardMetrics = (provider: string, metrics: UsageMetric[]): UsageMetric[] =>
  provider === 'ollama' ? metrics.filter(visibleOllamaMetric) : metrics

export const showMetricReset = (provider: string, m: UsageMetric): boolean =>
  !(provider === 'ollama' && m.id === 'purchased_balance')
