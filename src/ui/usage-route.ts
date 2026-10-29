import type { Context } from 'hono'
import type { UsageCollector } from '../infra/usage-collector.js'

export function usageRoute(collector: UsageCollector) {
  return async (c: Context) => {
    const report = await collector.getReport()
    return c.json(report, 200, { 'Cache-Control': 'no-store' })
  }
}
