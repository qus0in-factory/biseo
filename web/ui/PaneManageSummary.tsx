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
  const model = [pane.agentKind, pane.modelId].map(p => p?.trim()).filter(Boolean).join(' · ')
  const usage = paneUsageLabel(pane, providers, status)
  if (!model && !usage) return null
  return <span className="pane-manage-summary" title={[model, usage].filter(Boolean).join(' · ')}>
    {model && <span>{model}</span>}
    {usage && <span className="pane-manage-usage">{usage}</span>}
  </span>
}
