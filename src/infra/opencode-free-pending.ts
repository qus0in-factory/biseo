import type { ProviderUsage, WindowUsage, UsageMetric } from '../domain/usage-types.js'

export function freePendingUsage(now: Date): ProviderUsage {
  const chk = now.toISOString()
  const met: UsageMetric = { id: 'status', label: 'status', unit: 'status', used: null, limit: null, remaining: null, resetsAt: null }
  const win: WindowUsage = { window: 'primary', usedPercent: null, resetsAt: null, checkedAt: chk, limitReached: false, source: 'pending' }
  return { provider: 'opencode-free', state: 'available', metrics: [met], windows: [win], source: 'pending', checkedAt: chk }
}
