import type { UsageMetric } from '../domain/usage-types.js'

export function parseOllamaPct(inc: any): UsageMetric[] {
  const m: UsageMetric[] = []
  const s = inc?.session, w = inc?.weekly
  if (typeof s?.remaining_percent === 'number') {
    m.push({ id: 'session', label: 'Session', unit: 'percent', used: Math.max(0, 100 - s.remaining_percent), limit: 100, remaining: s.remaining_percent, resetsAt: s.resets_at ?? null })
  }
  if (typeof w?.remaining_percent === 'number') {
    m.push({ id: 'weekly', label: 'Weekly', unit: 'percent', used: Math.max(0, 100 - w.remaining_percent), limit: 100, remaining: w.remaining_percent, resetsAt: w.resets_at ?? null })
  }
  return m
}
