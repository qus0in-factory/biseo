import type { UsageSnapshot } from '../infra/d1-usage-types.js'

export function historyWindow(rows: UsageSnapshot[], names: string[], now: number) {
  const matches = rows.filter(row => names.includes(row.window))
  if (matches.length !== 1) return null
  const row = matches[0]
  const value = row.usedPercent
  if (row.state === 'unknown' || value === null || !Number.isFinite(value)) return null
  if (value < 0 || value > 100 || !row.resetsAt || Date.parse(row.resetsAt) <= now) return null
  if (!Number.isFinite(Date.parse(row.resetsAt))) return null
  return { value, reset: row.resetsAt }
}
