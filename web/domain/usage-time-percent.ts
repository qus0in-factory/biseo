import { usageRemainingTimePercent } from './usage-remaining-time.js'

export function usageTimePercent(
  label: string,
  startsAt: string | null | undefined,
  resetsAt: string | null | undefined,
  showRemaining = true,
  now = Date.now(),
): number | null {
  const left = usageRemainingTimePercent(label, startsAt, resetsAt, now)
  if (left === null) return null
  return showRemaining ? left : 100 - left
}
