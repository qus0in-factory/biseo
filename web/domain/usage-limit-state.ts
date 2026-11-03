import type { UsageMetric, UsageProvider, UsageWindow } from './usage'
import { metricLimited } from './metricLimited'
import { selectCardMetrics } from './usage-ollama'
import { isResetPassed } from './usage-auth-state'

export { metricLimited } from './metricLimited'

const quotaMetric = (m: UsageMetric): boolean =>
  (m.limit !== null && m.limit > 0) || Boolean(m.startsAt || m.resetsAt)

const windowLimited = (w: UsageWindow): boolean =>
  w.limitReached || (w.usedPercent !== null && w.usedPercent >= 100)

export const usageLimitStates = (p: UsageProvider) => {
  const metrics = p.metrics?.length ? selectCardMetrics(p.provider, p.metrics) : null
  if (!metrics) return p.windows.map((w) => {
    if (isResetPassed(w.resetsAt)) return { known: false, limited: false }
    const limited = windowLimited(w)
    return { known: limited || w.usedPercent !== null, limited }
  })
  return metrics.filter(quotaMetric).map((m) => {
    if (m.unit === 'percent' && isResetPassed(m.resetsAt)) return { known: false, limited: false }
    const limited = metricLimited(m, p.windows.some((w) => w.window === m.id && w.limitReached))
    return { known: limited || m.used !== null || m.remaining !== null, limited }
  })
}
