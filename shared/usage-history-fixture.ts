import type { UsageHistoryPoint } from './usage-history.js'
export function historyPoint(observed: number, five: number, week: number): UsageHistoryPoint {
  return { provider: 'codex', observed, five, week,
    fiveReset: '2030-01-01T00:00:00Z', weekReset: '2030-01-08T00:00:00Z' }
}
