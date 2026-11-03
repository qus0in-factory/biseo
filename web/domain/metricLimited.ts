import type { UsageMetric } from './usage'
import { metricRemaining } from './metricRemaining'

export const metricLimited = (m: UsageMetric, limitReached = false): boolean => {
  const left = metricRemaining(m)
  return limitReached || (left !== null && left <= 0) ||
    (m.used !== null && m.limit !== null && m.used >= m.limit)
}
