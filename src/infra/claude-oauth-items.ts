import type { WindowUsage, UsageMetric } from '../domain/usage-types.js'
import { makeClaudeWindow } from './claude-oauth-window.js'
import { makeClaudeMetric } from './claude-oauth-metric.js'

export function collectClaudeItems(data: any, chk: string) {
  const windows: WindowUsage[] = []
  if (data.five_hour) windows.push(makeClaudeWindow('primary', data.five_hour, chk))
  if (data.seven_day) windows.push(makeClaudeWindow('secondary', data.seven_day, chk))
  const metrics: UsageMetric[] = []
  for (const [k, v] of Object.entries(data)) {
    if (v && typeof v === 'object' && ('utilization' in v || 'resets_at' in v)) {
      metrics.push(makeClaudeMetric(k, v))
    }
  }
  return { windows, metrics }
}
