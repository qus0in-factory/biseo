import type { PaneSummary } from './timeline'
import type { UsageProvider } from './usage'
import { paneUsageLeftValues } from './paneUsageLeftValues'

export interface PaneUsageSummary {
  provider: string
  remaining: number
}

export function paneUsageSummary(pane: PaneSummary, providers: UsageProvider[]): PaneUsageSummary | null {
  const row = paneUsageLeftValues(pane, providers)
  if (!row) return null
  return { provider: row.provider, remaining: Math.min(...row.values) }
}
