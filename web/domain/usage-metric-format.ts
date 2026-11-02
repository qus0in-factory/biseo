import type { UsageMetric } from './usage'
import { metricRemaining } from './metricRemaining.js'
import { isResetPassed } from './usage-auth-state.js'
import { formatCurrency } from './usage-currency.js'
import r from '../resources.json'
const R = r as Record<string, string>
export function formatMetricValue(m: UsageMetric, unk = '알 수 없음', showRem?: boolean): string {
  if (m.unit === 'percent' && isResetPassed(m.resetsAt)) return R.usageUnconfirmed ?? '미확인'
  const s = showRem ?? (m.unit !== 'percent'), rem = metricRemaining(m)
  if (m.unit === 'percent') return s && rem !== null ? `${Math.max(0, rem)}%` : m.used !== null ? `${m.used}%` : unk
  if (m.unit === 'credits') return s && rem !== null ? `${rem} ${R.usageUnitCredits}` : m.used !== null ? `${m.used} ${R.usageUsedSuffix}` : unk
  if (m.unit === 'currency') return formatCurrency(m, unk, s)
  const u = m.unit === 'tokens' ? R.usageUnitTokens : m.unit === 'requests' ? R.usageUnitRequests : m.unit
  return m.used !== null ? `${m.used} ${u}` : unk
}
