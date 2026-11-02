import type { UsageProvider } from '../domain/usage'
import type { PaneSummary } from '../domain/timeline'
import { paneUsageSummary } from '../domain/paneUsageSummary'
import r from '../resources.json'

export function paneUsageLabel(pane: PaneSummary, providers: UsageProvider[], status: string) {
  const usage = paneUsageSummary(pane, providers)
  if (usage) return `${usage.provider} ${usage.remaining}%`
  if (status === 'loading') return r.usageMatching
  return status === 'error' ? r.usageError : r.usageWarningUnknown
}
