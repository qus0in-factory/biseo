import type { UsageMetric, UsageProvider, UsageWindow } from './usage'
import { metricRemaining } from './metricRemaining'
import { selectCardMetrics } from './usage-ollama'

export const metricLimited = (m: UsageMetric, limitReached = false): boolean => {
  const left = metricRemaining(m)
  return limitReached || (left !== null && left <= 0) ||
    (m.used !== null && m.limit !== null && m.used >= m.limit)
}

const windowLimited = (w: UsageWindow): boolean =>
  w.limitReached || (w.usedPercent !== null && w.usedPercent >= 100)

export function usageLimitCount(provider: UsageProvider): { available: number; limited: number } | null {
  const metrics = provider.metrics?.length ? selectCardMetrics(provider.provider, provider.metrics) : null
  const total = metrics?.length ?? provider.windows.length
  if (total < 2) return null
  const limited = metrics
    ? metrics.filter((m) => metricLimited(m, provider.windows.some((w) => w.window === m.id && w.limitReached))).length
    : provider.windows.filter(windowLimited).length
  return { available: total - limited, limited }
}
