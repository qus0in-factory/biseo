export function whamReset(win: any, checkedAt: string): string | null {
  const absolute = win?.reset_at
  const remaining = win?.reset_after_seconds
  const time = typeof absolute === 'number' && Number.isFinite(absolute)
    ? absolute * 1000
    : typeof remaining === 'number' && Number.isFinite(remaining) && remaining >= 0
      ? Date.parse(checkedAt) + remaining * 1000 : NaN
  const date = new Date(time)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}
