import { AlertTriangle } from 'lucide-react'
import type { PaneSummary } from '../domain/timeline'
import type { UsageProvider } from '../domain/usage'
import { evaluatePaneUsageWarning } from '../domain/pane-usage-warning'
import type { UsageWarningConfig } from '../domain/usage-warning'
import { HintPopover } from './HintPopover'
import { warningIconClass } from './paneUsageWarningClass'
import r from '../resources.json'

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
  const w = evaluatePaneUsageWarning(pane, providers, config, r)
  if (!w.hasWarning || !w.label) return null

  return (
    <HintPopover label={w.label} className={warningIconClass()}>
      <span role="status" className="inline-flex shrink-0 items-center">
        <AlertTriangle size={13} aria-hidden="true" className="block shrink-0" />
      </span>
    </HintPopover>
  )
}
