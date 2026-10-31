import { pct, str } from './usage-values.js'

// The values of one usage row, normalized from the upstream payload.
export const rowMetric = (
  w: Record<string, unknown>,
): [string, number | null, number | null, number | null] => {
  const unit = str(w.unit) ?? 'percent'
  const used = typeof w.used === 'number' ? w.used : pct(w.usedPercent)
  const limit = typeof w.limit === 'number' ? w.limit : unit === 'percent' ? 100 : null
  const remaining = typeof w.remaining === 'number'
    ? w.remaining
    : unit === 'percent' && used !== null
      ? Math.max(0, 100 - used)
      : null
  return [unit, used, limit, remaining]
}
