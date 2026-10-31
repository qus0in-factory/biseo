import type { PaneSummary } from './timeline'
import type { UsageProvider } from './usage'
import { DEFAULT_USAGE_WARNING_CONFIG, type UsageWarningConfig } from './usage-warning'
import { findMatchingUsage } from './pane-usage-match'
import type { PaneUsageWarningResult } from './pane-usage-warning-types'
import { buildUnknownResult } from './pane-usage-warning-unknown'
import { evalPaneWindows } from './pane-usage-warning-eval-win'
import { paneUsageWindows } from './pane-usage-windows'

export type { PaneUsageWarningResult }

export function evaluatePaneUsageWarning(
  pane: PaneSummary,
  providers: UsageProvider[],
  cfg: UsageWarningConfig = DEFAULT_USAGE_WARNING_CONFIG,
  res?: Record<string, string>,
): PaneUsageWarningResult {
  const p = findMatchingUsage(pane, providers)
  if (!p || p.state === 'unknown') return buildUnknownResult(res)
  return evalPaneWindows(paneUsageWindows(pane, p), cfg, res)
}
