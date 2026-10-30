import { pct, str } from './usage-values.js'

// The values of one usage row, normalized from the upstream payload.
export const rowMetric = (
  w: Record<string, unknown>,
): [string, number | null, number, number | null] => {
  const unit = str(w.unit) ?? 'percent'
  const used = typeof w.used === 'number' ? w.used : pct(w.usedPercent)
  const limit = typeof w.limit === 'number' ? w.limit : 100
  const remaining = typeof w.remaining === 'number'
    ? w.remaining
    : used !== null
      ? Math.max(0, 100 - used)
      : null
  return [unit, used, limit, remaining]
}
