const DAY_MS = 86_400_000
const WINDOW_MS: Record<string, number> = { w: 7 * DAY_MS, m: 30 * DAY_MS }

export function usageWindowKind(label: string): 'w' | 'm' | null {
  const s = label.trim().toLowerCase()
  if (s === 'w' || s === 'weekly') return 'w'
  if (s === 'm' || s === 'monthly') return 'm'
  return null
}

export function usageRemainingTimePercent(
  label: string,
  startsAt: string | null | undefined,
  resetsAt: string | null | undefined,
  now = Date.now(),
): number | null {
  const kind = usageWindowKind(label)
  if (!kind || !resetsAt) return null
  const end = Date.parse(resetsAt)
  if (!Number.isFinite(end)) return null
  const start = startsAt ? Date.parse(startsAt) : NaN
  const length = Number.isFinite(start) && start < end ? end - start : WINDOW_MS[kind]
  const left = Math.max(0, Math.min(length, end - now))
  return Math.round((left / length) * 100)
}
