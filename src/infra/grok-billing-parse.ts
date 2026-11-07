import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { windowsToMetrics } from '../domain/usage-metric-compat.js'
import { grokBillingPeriod } from './grok-billing-period.js'

export function parseGrokBilling(data: any, now = new Date()): ProviderUsage {
  const root = data?.config ?? data
  const u = root?.creditUsagePercent
  if (typeof u !== 'number' || !Number.isFinite(u)) return unknownUsage('grok')
  const chk = now.toISOString()
  const r = typeof root?.billingPeriodEnd === 'string' ? root.billingPeriodEnd : null
  const rAct = Boolean(r && Date.parse(r) > now.getTime())
  const lim = Boolean(u >= 100 && rAct)

  const w: WindowUsage = {
    ...grokBillingPeriod(root),
    usedPercent: u,
    resetsAt: r,
    checkedAt: chk,
    limitReached: u >= 100,
    source: 'grok'
  }
  const windows = [w]
  return { provider: 'grok', state: lim ? 'limited' : 'available', metrics: windowsToMetrics(windows), windows }
}
