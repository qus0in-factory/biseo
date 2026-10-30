import type { WindowUsage } from '../domain/usage-types.js'

export function makeAgyWindow(
  w: 'primary' | 'secondary',
  bucket: any,
  chk: string
): WindowUsage {
  const rem = typeof bucket?.remainingFraction === 'number' ? bucket.remainingFraction : null
  const u = rem !== null ? Math.round((1 - rem) * 100) : null
  const resetsAt = typeof bucket?.resetTime === 'string' ? bucket.resetTime : null
  const limitReached = Boolean(bucket?.remainingFraction === 0 || bucket?.disabled)
  return {
    window: w,
    usedPercent: u,
    resetsAt,
    checkedAt: chk,
    limitReached,
    source: 'antigravity'
  }
}
