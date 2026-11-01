import type { UsageHistoryPoint } from './usage-history.js'

export function historyInterval(a: UsageHistoryPoint, b: UsageHistoryPoint) {
  const elapsed = b.observed - a.observed
  if (elapsed <= 0 || a.provider !== b.provider) return null
  if (a.fiveReset !== b.fiveReset || a.weekReset !== b.weekReset) return null
  if (Date.parse(a.fiveReset) <= b.observed || Date.parse(a.weekReset) <= b.observed) return null
  const five = b.five - a.five
  const week = b.week - a.week
  if (five < 0 || week < 0 || (five === 0 && week > 0)) return null
  return { five, week }
}
