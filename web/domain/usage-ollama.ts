import type { UsageMetric } from './usage'
import { BALANCE_METRIC_IDS, isBalanceMetric } from './usage-balance.js'

const ALLOW: Record<string, readonly string[]> = {
  ollama: BALANCE_METRIC_IDS,
  'opencode-go': ['primary', 'secondary', 'monthly'],
}

export const visibleOllamaMetric = isBalanceMetric

export const selectCardMetrics = (provider: string, metrics: UsageMetric[]): UsageMetric[] => {
  const allow = ALLOW[provider]
  return allow ? metrics.filter((m) => allow.includes(m.id)) : metrics
}

export const showMetricReset = (provider: string, m: UsageMetric): boolean =>
  !(provider === 'ollama' && m.id === 'purchased_balance')
