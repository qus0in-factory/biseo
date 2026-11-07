export function claudeRetryAfter(raw: string | null, now: number): number {
  if (!raw?.trim()) return 0
  const value = Number(raw)
  const ms = Number.isFinite(value) ? value * 1000 : Date.parse(raw) - now
  return Number.isFinite(ms) ? Math.max(0, ms) : 0
}
