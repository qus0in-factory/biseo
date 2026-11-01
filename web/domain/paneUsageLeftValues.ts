import type { PaneSummary } from './timeline'
import type { UsageProvider } from './usage'
import { findMatchingUsage } from './pane-usage-match'
import { paneAgyMetrics } from './pane-usage-windows'

const left = (used: number | null, remaining?: number | null): number | null => {
  const value = used !== null ? 100 - used : remaining ?? null
  return value === null || !Number.isFinite(value) ? null : Math.max(0, Math.min(100, Math.round(value)))
}

export function paneUsageLeftValues(
  pane: PaneSummary,
  providers: UsageProvider[],
): { provider: string; values: number[] } | null {
  const p = findMatchingUsage(pane, providers)
  if (!p || p.state === 'unknown') return null
  const values = (p.provider === 'agy'
    ? paneAgyMetrics(pane, p).map((m) => left(m.used, m.remaining))
    : p.windows.map((w) => left(w.usedPercent))
  ).filter((v): v is number => v !== null)
  return values.length ? { provider: p.provider, values } : null
}
