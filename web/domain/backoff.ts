export function calculateBackoff(
  attempt: number,
  baseMs = 1000,
  maxMs = 30000,
  jitterRatio = 0.1,
): number {
  const exp = Math.min(maxMs, baseMs * 2 ** Math.max(0, attempt))
  const jitter = Math.floor(exp * jitterRatio * Math.random())
  return Math.min(maxMs, exp + jitter)
}
