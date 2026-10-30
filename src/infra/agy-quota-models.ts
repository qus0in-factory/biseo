import type { UsageMetric } from '../domain/usage-types.js'

export function groupModelBuckets(buckets: any[]): UsageMetric[] {
  if (!Array.isArray(buckets) || buckets.length === 0) return []
  const gemini = buckets.filter(b => typeof b.modelId === 'string' && b.modelId.includes('gemini'))
  if (gemini.length === 0) return []
  const minRem = Math.min(...gemini.map(b => typeof b.remainingFraction === 'number' ? b.remainingFraction : 1))
  const reset = gemini.find(b => typeof b.resetTime === 'string')?.resetTime ?? null
  const used = Math.round((1 - minRem) * 100)
  const remaining = Math.round(minRem * 100)
  return [{
    id: 'Gemini models:gemini-daily',
    label: 'Gemini models - Daily Limit Remaining',
    unit: 'percent',
    used,
    limit: 100,
    remaining,
    resetsAt: reset
  }]
}
