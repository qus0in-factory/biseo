import type { WindowUsage, UsageMetric } from '../domain/usage-types.js'
import { makeClaudeWindow } from './claude-oauth-window.js'
import { makeClaudeMetric } from './claude-oauth-metric.js'

const known = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === 'object' &&
  (typeof (v as Record<string, unknown>).utilization === 'number' ||
    typeof (v as Record<string, unknown>).resets_at === 'string')

export function collectClaudeItems(data: Record<string, unknown>, chk: string) {
  const windows: WindowUsage[] = []
  if (known(data.five_hour)) windows.push(makeClaudeWindow('primary', data.five_hour, chk))
  if (known(data.seven_day)) windows.push(makeClaudeWindow('secondary', data.seven_day, chk))
  const metrics: UsageMetric[] = []
  for (const [k, v] of Object.entries(data)) {
    if (known(v)) metrics.push(makeClaudeMetric(k, v))
  }
  return { windows, metrics }
}
