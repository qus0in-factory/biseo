import type { UsageWindow } from '../domain/usage'
import { usagePercentText, usageWindowName } from '../domain/usage-text'
import { isResetPassed } from '../domain/usage-auth-state'
import r from '../resources.json'

export function usageWindowDisplay(provider: string, value: UsageWindow, remaining: boolean) {
  const name = usageWindowName(provider, value.window, r)
  const shown = remaining && value.usedPercent !== null ? Math.max(0, 100 - value.usedPercent) : value.usedPercent
  const stale = isResetPassed(value.resetsAt)
  const text = stale ? r.usageUnconfirmed : usagePercentText(shown, r.usageUnknownPercent)
  return { name, text, stale }
}
