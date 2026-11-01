import type { UsageHistoryPoint, UsageHistoryRatio } from './usage-history.js'
import { historyInterval } from './usage-history-interval.js'

export function historyRatio(points: UsageHistoryPoint[], minimum: number): UsageHistoryRatio {
  let five = 0, week = 0, samples = 0
  let from: number | null = null, to: number | null = null
  const sorted = [...points].sort((a, b) => a.observed - b.observed)
  for (let i = 1; i < sorted.length; i++) {
    const delta = historyInterval(sorted[i - 1], sorted[i])
    if (!delta || delta.five === 0) continue
    five += delta.five
    week += delta.week
    samples++
    from ??= sorted[i - 1].observed
    to = sorted[i].observed
  }
  return { ratio: samples >= minimum && five > 0 ? week / five : null, samples, from, to }
}
