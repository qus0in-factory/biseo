import type { PaneSummary } from './timeline'

export const INTERRUPT_KEY = 'esc' as const
export type InterruptKey = typeof INTERRUPT_KEY

export function isLimitedPane(target?: PaneSummary): boolean {
  if (!target) return false
  if (target.blockedReason === 'usage_limit') return true
  return target.availability?.state === 'limited'
}

export function canInterrupt(
  target?: PaneSummary,
  online: boolean = true,
  inFlight: boolean = false,
): boolean {
  if (!target || !online || inFlight) return false
  if (isLimitedPane(target)) return false
  return target.status === 'blocked'
}
