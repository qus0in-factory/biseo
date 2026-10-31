import type { PaneSummary } from './timeline'
import type { UsageProvider } from './usage'
import { DEFAULT_USAGE_WARNING_CONFIG, type UsageWarningConfig } from './usage-warning'
import { findMatchingUsage } from './pane-usage-match'
import { evaluateUsageWindows } from './usage-warning-eval'
import type { PaneUsageWarningResult } from './pane-usage-warning-types'
import { buildWarningResult } from './pane-usage-warning-res'

export type { PaneUsageWarningResult }

const U: PaneUsageWarningResult = { hasWarning: false, exceededWindows: [], isUnknown: true, label: null }

export function evaluatePaneUsageWarning(
  pane: PaneSummary,
  providers: UsageProvider[],
  cfg: UsageWarningConfig = DEFAULT_USAGE_WARNING_CONFIG,
  res?: Record<string, string>,
): PaneUsageWarningResult {
  const p = findMatchingUsage(pane, providers)
  if (!p || p.state === 'unknown' || !p.windows?.length) return U
  const r = evaluateUsageWindows(p.windows, cfg)
  return r.hasValid ? buildWarningResult(r.exceeded, res) : U
}
