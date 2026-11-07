import type { ProviderUsage } from '../domain/usage-types.js'

export function staleClaude(u: ProviderUsage, fresh: ProviderUsage, now: Date): ProviderUsage {
  const active = (w: { resetsAt: string | null }) =>
    !!w.resetsAt && Date.parse(w.resetsAt) > now.getTime()
  const windows = u.windows.filter(active).map(w => ({ ...w, source: 'claude-stale' }))
  if (!windows.length) return fresh
  return {
    ...u, state: 'unknown', reason: fresh.reason, retryAt: fresh.retryAt,
    source: 'claude-stale', windows, metrics: u.metrics.filter(active),
  }
}
