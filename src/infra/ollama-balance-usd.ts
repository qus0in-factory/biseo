import type { UsageMetric } from '../domain/usage-types.js'

export function parseOllamaUsd(data: any): UsageMetric[] {
  const m: UsageMetric[] = [], inc = data?.included, p = data?.purchased
  if (typeof inc?.balance_usd === 'number') {
    const a = typeof inc.allowance_usd === 'number' ? inc.allowance_usd : null
    const b = inc.balance_usd
    const u = typeof a === 'number' ? Math.round((a - b) * 100) / 100 : null
    m.push({ id: 'included_balance', label: 'included_balance', unit: 'currency', used: u, limit: a, remaining: b, startsAt: inc.period?.from ?? null, resetsAt: inc.period?.until ?? null })
  }
  if (typeof p?.balance_usd === 'number') {
    m.push({ id: 'purchased_balance', label: 'purchased_balance', unit: 'currency', used: null, limit: null, remaining: p.balance_usd, resetsAt: null })
  }
  return m
}
