import type { UsageWindow } from './usage'
import type { UsageWarningConfig } from './usage-warning'
import { normalizeWarningWindow } from './usage-window-norm'

export function evaluateUsageWindows(
  windows: UsageWindow[] = [],
  cfg: UsageWarningConfig,
): { exceeded: string[]; hasValid: boolean } {
  const exceeded: string[] = []
  let hasValid = false

  for (const win of windows) {
    if (win.usedPercent === null || win.usedPercent === undefined) continue
    const norm = normalizeWarningWindow(win.window)
    if (!norm) continue

    hasValid = true
    if (norm === '5h' && win.usedPercent >= cfg.fiveHour) {
      if (!exceeded.includes('5h')) exceeded.push('5h')
    } else if (norm === 'w' && win.usedPercent >= cfg.weekly) {
      if (!exceeded.includes('w')) exceeded.push('w')
    } else if (norm === 'm' && win.usedPercent >= cfg.monthly) {
      if (!exceeded.includes('m')) exceeded.push('m')
    }
  }

  return { exceeded, hasValid }
}
