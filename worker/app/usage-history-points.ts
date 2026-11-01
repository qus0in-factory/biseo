import type { UsageSnapshot } from '../infra/d1-usage-types.js'
import type { UsageHistoryPoint } from '../../shared/usage-history.js'
import { historyWindow } from './usage-history-window.js'

export function historyPoints(rows: UsageSnapshot[], observed: number): UsageHistoryPoint[] {
  return [...new Set(rows.map(row => row.provider))].flatMap(provider => {
    const group = rows.filter(row => row.provider === provider)
    const five = historyWindow(group, ['5h', 'primary', 'five_hour'], observed)
    const week = historyWindow(group, ['w', 'secondary', 'weekly', 'seven_day'], observed)
    if (!five || !week) return []
    return [{ provider, observed, five: five.value, week: week.value,
      fiveReset: five.reset, weekReset: week.reset }]
  })
}
