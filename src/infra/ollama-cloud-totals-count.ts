import type { UsageMetric } from '../domain/usage-types.js'
export function parseOllamaTotalsCount(data: any): UsageMetric[] {
  const m: UsageMetric[] = []
  const totals = data?.totals
  if (totals && typeof totals === 'object') {
    if (typeof totals.request_count === 'number') m.push({ id: 'requests', label: 'Requests', unit: 'requests', used: totals.request_count, limit: null, remaining: null, resetsAt: null })
    if (typeof totals.usage_usd === 'number') m.push({ id: 'usage_usd', label: 'Usage USD', unit: 'currency', used: totals.usage_usd, limit: null, remaining: null, resetsAt: null })
  }
  return m
}
