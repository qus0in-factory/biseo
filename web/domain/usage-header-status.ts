import type { UsageProvider } from './usage'
import { isAuthRequired } from './usage-auth-state.js'
import { isUsageFailure } from './usage-failure-state'

export function usageHeaderStatus(p: UsageProvider, res: Record<string, string>) {
  const st = isAuthRequired(p)
  if (isUsageFailure(p)) return { title: res[p.reason!], icon: 'alert' as const, cls: 'text-muted-foreground' }
  const base = res[`usage_${p.state}`] ?? p.state
  const title = st ? `${base} (${res.auth_required})` : base
  const icon: 'alert' | 'check' | 'help' = st || p.state === 'limited' ? 'alert' : p.state === 'available' ? 'check' : 'help'
  const cls = st || p.state === 'unknown' ? 'text-muted-foreground' : p.state === 'limited' ? 'text-error' : 'text-success'
  return { title, icon, cls }
}
