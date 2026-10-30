import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { windowsToMetrics } from '../domain/usage-metric-compat.js'

export function agyUnknownUsage(now = new Date(), retryAfterMs = 300000): ProviderUsage {
  const chk = now.toISOString()
  const r = new Date(now.getTime() + retryAfterMs).toISOString()
  const w: WindowUsage = {
    window: 'primary',
    usedPercent: null,
    resetsAt: r,
    checkedAt: chk,
    limitReached: false,
    source: 'google-oauth-unauthenticated'
  }
  const windows = [w]
  return {
    provider: 'agy',
    state: 'unknown',
    metrics: windowsToMetrics(windows),
    windows,
    source: 'google-oauth-unauthenticated',
    checkedAt: chk,
    retryAt: r
  }
}
