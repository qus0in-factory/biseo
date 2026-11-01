import type { PaneUsageWarningResult } from './pane-usage-warning-types'
import { formatWarningLabel } from './pane-usage-warning-label'

export function buildWarningResult(
  exceeded: string[],
  res?: Record<string, string>,
): PaneUsageWarningResult {
  const has = exceeded.length > 0
  return {
    hasWarning: has,
    exceededWindows: exceeded,
    isUnknown: false,
    label: has ? formatWarningLabel(exceeded, res) : null,
  }
}
