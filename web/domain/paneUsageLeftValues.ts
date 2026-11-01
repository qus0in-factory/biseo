import type { PaneSummary } from './timeline'
import type { UsageProvider } from './usage'
import { findMatchingUsage } from './pane-usage-match'
import { paneUsageWindows } from './pane-usage-windows'

const left = (used: number | null): number | null => {
  const value = used !== null ? 100 - used : null
  return value === null || !Number.isFinite(value) ? null : Math.max(0, Math.min(100, Math.round(value)))
}

export function paneUsageLeftValues(
  pane: PaneSummary,
  providers: UsageProvider[],
): { provider: string; values: number[] } | null {
  const p = findMatchingUsage(pane, providers)
  if (!p || p.state === 'unknown') return null
  const values = paneUsageWindows(pane, p)
    .map((w) => left(w.usedPercent))
    .filter((v): v is number => v !== null)
  return values.length ? { provider: p.provider, values } : null
}
