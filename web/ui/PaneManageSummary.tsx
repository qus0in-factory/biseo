import type { PaneSummary } from '../domain/timeline'
import type { UsageProvider } from '../domain/usage'
import { paneUsageSummary } from '../domain/paneUsageSummary'

export function PaneManageSummary({
  pane,
  providers,
}: {
  pane: PaneSummary
  providers: UsageProvider[]
}) {
  const usage = paneUsageSummary(pane, providers)
  const parts = [pane.agentKind, pane.modelId]
  if (usage) parts.push(`${usage.provider} ${usage.remaining}%`)
  const text = parts.map((part) => part?.trim()).filter(Boolean).join(' · ')
  if (!text) return null
  return <span className="pane-manage-summary" title={text}>{text}</span>
}
