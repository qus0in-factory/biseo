import { AlertTriangle } from 'lucide-react'
import type { PaneSummary } from '../domain/timeline'
import type { UsageProvider } from '../domain/usage'
import { evaluatePaneUsageWarning } from '../domain/pane-usage-warning'
import type { UsageWarningConfig } from '../domain/usage-warning'
import { warningIconClass } from './paneUsageWarningClass'
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
  if (!providers?.length) return null
  const w = evaluatePaneUsageWarning(pane, providers, config, res)
  if (!w.hasWarning || !w.label) return null

  return (
    <span
      className={warningIconClass()}
      title={w.label}
      aria-label={w.label}
      role="status"
    >
      <AlertTriangle size={13} aria-hidden="true" className="block shrink-0" />
    </span>
  )
}
