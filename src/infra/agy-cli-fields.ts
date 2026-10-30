export function cliFraction(s: string): number | null {
  const t = s.trim()
  if (!t) return null
  const v = Number(t.endsWith('%') ? t.slice(0, -1) : t)
  return Number.isFinite(v) && v >= 0 && v <= 100 ? v / 100 : null
}

export function cliReset(s: string): string | null {
  const t = s.trim()
  const ms = /^\d{4}-\d{2}-\d{2}/.test(t) ? Date.parse(t) : NaN
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null
}
