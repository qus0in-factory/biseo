import { AlertTriangle } from 'lucide-react'
import type { PaneSummary } from '../domain/timeline'
import type { UsageProvider } from '../domain/usage'
import { evaluatePaneUsageWarning } from '../domain/pane-usage-warning'
import type { UsageWarningConfig } from '../domain/usage-warning'
import r from '../resources.json'

const res = r as Record<string, string>

export function PaneUsageWarning({
  pane,
  providers,
  config,
}: {
  pane: PaneSummary
  providers?: UsageProvider[]
  config?: UsageWarningConfig
}) {
  if (!providers || providers.length === 0) return null
  const warning = evaluatePaneUsageWarning(pane, providers, config, res)
  if (!warning.hasWarning || !warning.label) return null

  return (
    <span
      className="inline-flex shrink-0 items-center text-amber-500"
      title={warning.label}
      aria-label={warning.label}
      role="status"
    >
      <AlertTriangle size={13} aria-hidden="true" className="block shrink-0" />
    </span>
  )
}
