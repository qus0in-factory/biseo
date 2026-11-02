import type { Availability } from './availability'
import type { PaneSummary } from './timeline'
import type { UsageProvider } from './usage'
import { findMatchingUsage } from './pane-usage-match'
import { paneUsageWindows } from './pane-usage-windows'
import { isStaleProvider } from './usage-auth-state'

export function resolvePaneAvailability(pane: PaneSummary, providers?: UsageProvider[]): Availability | undefined {
  const b = pane.availability
  if (b?.state === 'limited' || b?.state === 'available' || !providers?.length) return b
  const p = findMatchingUsage(pane, providers)
  if (!p || p.state === 'unknown' || isStaleProvider(p)) return b
  const w = paneUsageWindows(pane, p)
  if (!w.length) return b
  const h = w.find((x) => x.limitReached || (x.usedPercent ?? 0) >= 100)
  return { state: h ? 'limited' : 'available', source: p.provider, checkedAt: h?.checkedAt ?? w[0]?.checkedAt ?? null, resetsAt: h?.resetsAt ?? null, reason: h ? 'rate_limit_reached' : null, window: null }
}
