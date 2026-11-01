import type { PaneUsageWarningResult } from './pane-usage-warning-types'

export function buildUnknownResult(
  res?: Record<string, string>,
): PaneUsageWarningResult {
  return {
    hasWarning: false,
    exceededWindows: [],
    isUnknown: true,
    label: res?.usageWarningUnknown ?? '사용량 미확인',
  }
}
