export function balancePercent(used: number | null, limit: number | null): number | null {
  if (used === null || limit === null || !Number.isFinite(used) || !Number.isFinite(limit) || limit <= 0) return null
  return Math.round(Math.max(0, Math.min(1, used / limit)) * 100)
}
