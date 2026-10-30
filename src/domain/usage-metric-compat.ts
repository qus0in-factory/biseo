import type { WindowUsage, UsageMetric } from './usage-types.js'

export function windowsToMetrics(windows: WindowUsage[]): UsageMetric[] {
  return windows.map(w => ({
    id: w.window,
    label: w.window,
    unit: 'percent',
    used: w.usedPercent,
    limit: 100,
    remaining: w.usedPercent !== null ? Math.max(0, 100 - w.usedPercent) : null,
    resetsAt: w.resetsAt
  }))
}
