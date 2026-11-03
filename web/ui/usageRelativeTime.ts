const formatter = new Intl.RelativeTimeFormat('ko', { numeric: 'always' })

export function usageRelativeTime(at: string, now = Date.now()): string | null {
  const delta = Date.parse(at) - now
  if (!Number.isFinite(delta)) return null
  const minutes = Math.ceil(Math.abs(delta) / 60_000)
  const unit = minutes < 60 ? 'minute' : minutes < 1440 ? 'hour' : 'day'
  const divisor = unit === 'minute' ? 1 : unit === 'hour' ? 60 : 1440
  const value = Math.ceil(minutes / divisor) * (delta < 0 ? -1 : 1)
  return formatter.format(value, unit)
}
