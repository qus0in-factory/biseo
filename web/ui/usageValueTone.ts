import { normalizeWarningWindow } from '../domain/usage-window-norm'
import { DEFAULT_USAGE_WARNING_CONFIG as config } from '../domain/usage-warning'

export function usageValueTone(used: number | null, window: string, limited = false) {
  if (limited || (used !== null && used >= 100)) return 'danger'
  const kind = normalizeWarningWindow(window.split(':').pop()!)
  const threshold = kind === '5h' ? config.fiveHour : kind === 'w' ? config.weekly : config.monthly
  return kind && used !== null && used >= threshold ? 'warning' : null
}
