import type { PaneUsageWarningResult } from './pane-usage-warning-types'
import { evaluateUsageWindows } from './usage-warning-eval'
import { buildWarningResult } from './pane-usage-warning-res'
import { buildUnknownResult } from './pane-usage-warning-unknown'
import type { UsageWarningConfig } from './usage-warning'
import type { UsageWindow } from './usage'

export function evalPaneWindows(
  windows: UsageWindow[] | undefined,
  cfg: UsageWarningConfig,
  res?: Record<string, string>,
): PaneUsageWarningResult {
  if (!windows?.length) return buildUnknownResult(res)
  const r = evaluateUsageWindows(windows, cfg)
  return r.hasValid ? buildWarningResult(r.exceeded, res) : buildUnknownResult(res)
}
