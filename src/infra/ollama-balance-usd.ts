import type { UsageMetric } from '../domain/usage-types.js'

export function parseOllamaUsd(data: any): UsageMetric[] {
  const m: UsageMetric[] = [], inc = data?.included, p = data?.purchased
  if (typeof inc?.balance_usd === 'number') {
    const a = inc.allowance_usd, b = inc.balance_usd
    const u = typeof a === 'number' ? Math.round((a - b) * 100) / 100 : null
    m.push({ id: 'included_balance', label: 'Included Balance', unit: 'currency', used: u, limit: a ?? null, remaining: b, resetsAt: inc.period?.until ?? null })
  }
  if (typeof p?.balance_usd === 'number') {
    m.push({ id: 'purchased_balance', label: 'Purchased Balance', unit: 'currency', used: null, limit: null, remaining: p.balance_usd, resetsAt: null })
  }
  return m
}
