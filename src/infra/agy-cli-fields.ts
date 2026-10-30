export function cliFraction(s: string): number | null {
  const t = s.trim()
  const v = Number(t.endsWith('%') ? t.slice(0, -1) : t)
  return Number.isFinite(v) && v >= 0 && v <= 100 ? v / 100 : null
}

export function cliWindow(w: string): string {
  const v = w.toLowerCase()
  if (v.includes('5h') || v.includes('5 hour')) return '5h'
  if (v.includes('week')) return 'weekly'
  return w.trim()
}

export function cliReset(s: string): string | null {
  const t = s.trim()
  const ms = /^\d{4}-\d{2}-\d{2}/.test(t) ? Date.parse(t) : NaN
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null
}
