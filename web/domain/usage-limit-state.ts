import type { UsageMetric, UsageProvider, UsageWindow } from './usage'
import { metricRemaining } from './metricRemaining'
import { selectCardMetrics } from './usage-ollama'

export const metricLimited = (m: UsageMetric, limitReached = false): boolean => {
  const left = metricRemaining(m)
  return limitReached || (left !== null && left <= 0) ||
    (m.used !== null && m.limit !== null && m.used >= m.limit)
}

const quotaMetric = (m: UsageMetric): boolean =>
  (m.limit !== null && m.limit > 0) || Boolean(m.startsAt || m.resetsAt)

const windowLimited = (w: UsageWindow): boolean =>
  w.limitReached || (w.usedPercent !== null && w.usedPercent >= 100)

export const usageLimitStates = (p: UsageProvider) => {
  const metrics = p.metrics?.length ? selectCardMetrics(p.provider, p.metrics) : null
  if (!metrics) return p.windows.map((w) => {
    const limited = windowLimited(w)
    return { known: limited || w.usedPercent !== null, limited }
  })
  return metrics.filter(quotaMetric).map((m) => {
    const limited = metricLimited(m, p.windows.some((w) => w.window === m.id && w.limitReached))
    return { known: limited || m.used !== null || m.remaining !== null, limited }
  })
}
