import type { UsageMetric } from './usage'
import { metricRemaining } from './metricRemaining.js'
import r from '../resources.json'
const R = r as Record<string, string>
export function formatCountedMetric(m: UsageMetric, unk: string, show: boolean): string | null {
  const rem = metricRemaining(m)
  if (m.unit === 'percent') return show && rem !== null ? `${Math.max(0, rem)}%` : m.used !== null ? `${m.used}%` : unk
  if (m.unit === 'credits') return show && rem !== null ? `${rem} ${R.usageUnitCredits}` : m.used !== null ? `${m.used} ${R.usageUsedSuffix}` : unk
  if (m.unit === 'tokens' || m.unit === 'requests') {
    const u = m.unit === 'tokens' ? R.usageUnitTokens : R.usageUnitRequests
    return m.used !== null ? `${m.used} ${u}` : unk
  }
  return null
}
