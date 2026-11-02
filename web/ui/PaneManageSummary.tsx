import type { PaneSummary } from '../domain/timeline'
import type { UsageProvider } from '../domain/usage'
import { paneUsageLabel } from './paneUsageLabel'
import { useUsageStore } from '../app/useUsageStore'

export function PaneManageSummary({
  pane,
  providers,
}: {
  pane: PaneSummary
  providers: UsageProvider[]
}) {
  const status = useUsageStore(s => s.status)
  const parts = [pane.agentKind, pane.modelId, paneUsageLabel(pane, providers, status)]
  const text = parts.map((part) => part?.trim()).filter(Boolean).join(' · ')
  if (!text) return null
  return <span className="pane-manage-summary" title={text}>{text}</span>
}
