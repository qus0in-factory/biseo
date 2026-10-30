import type { UsageMetric } from '../domain/usage.js'

export const metric = (id: string, unit: string, extra = {}): UsageMetric => ({
  id, label: id, unit, used: 1, limit: null, remaining: 1, resetsAt: null, ...extra,
})

export const shot: UsageMetric[] = [
  metric('cached_input_tokens', 'tokens', { used: 936895202 }),
  metric('included_balance', 'currency', { used: 60, limit: 60, remaining: 0, resetsAt: '2026-11-01T05:40:03.000Z' }),
  metric('input_tokens', 'tokens', { used: 957089517 }),
  metric('output_tokens', 'tokens', { used: 4782263 }),
  metric('purchased_balance', 'currency', { used: null, remaining: 7.01337 }),
  metric('requests', 'requests', { used: 4284 }),
  metric('usage_usd', 'currency', { used: 90.97 }),
]
