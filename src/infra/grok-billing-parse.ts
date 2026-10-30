import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'

export function parseGrokBilling(data: any, now = new Date()): ProviderUsage {
  const root = data?.config ?? data
  const u = typeof root?.creditUsagePercent === 'number' ? root.creditUsagePercent : null
  if (u === null) return unknownUsage('grok')
  const chk = now.toISOString()
  const r = typeof root?.billingPeriodEnd === 'string' ? root.billingPeriodEnd : null
  const rAct = Boolean(r && Date.parse(r) > now.getTime())
  const lim = Boolean(u >= 100 && rAct)

  const w: WindowUsage = {
    window: 'primary',
    usedPercent: u,
    resetsAt: r,
    checkedAt: chk,
    limitReached: u >= 100,
    source: 'grok'
  }

  return {
    provider: 'grok',
    state: lim ? 'limited' : 'available',
    windows: [w]
  }
}
