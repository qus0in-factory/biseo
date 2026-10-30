import type { UsageMetric } from '../domain/usage-types.js'
export function parseOllamaLimits(data: any): UsageMetric[] {
  const m: UsageMetric[] = []
  const limits = data?.limits
  if (limits && typeof limits === 'object') {
    for (const id of ['session', 'weekly', 'monthly']) {
      const u = limits[id]?.usage
      if (typeof u === 'number' && Number.isFinite(u) && u >= 0 && u <= 1) {
        m.push({ id, label: id[0].toUpperCase() + id.slice(1), unit: 'percent', used: Math.round(u * 100), limit: 100, remaining: Math.round((1 - u) * 100), resetsAt: null })
      }
    }
  }
  return m
}
