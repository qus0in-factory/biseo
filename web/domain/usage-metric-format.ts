import type { UsageMetric } from './usage'
import { isResetPassed } from './usage-auth-state.js'
import { formatCurrencyMetric } from './usage-metric-currency.js'
import { formatCountedMetric } from './usage-metric-units.js'
import r from '../resources.json'
const R = r as Record<string, string>
const UNKNOWN = '\u0000'
export const metricValueUnknown = (m: UsageMetric, showRem?: boolean): boolean =>
  formatMetricValue(m, UNKNOWN, showRem) === UNKNOWN
export function formatMetricValue(m: UsageMetric, unk = '알 수 없음', showRem?: boolean): string {
  if (m.unit === 'percent' && isResetPassed(m.resetsAt)) return R.usageUnconfirmed ?? '미확인'
  const show = showRem ?? (m.unit !== 'percent')
  if (m.unit === 'currency') return formatCurrencyMetric(m, unk, show)
  return formatCountedMetric(m, unk, show) ?? (m.used !== null ? `${m.used} ${m.unit}` : unk)
}
