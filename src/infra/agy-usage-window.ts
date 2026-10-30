import type { WindowUsage } from '../domain/usage-types.js'

export function makeAgyWindow(
  w: 'primary' | 'secondary',
  bucket: any,
  chk: string
): WindowUsage {
  const rem = typeof bucket?.remainingFraction === 'number' ? bucket.remainingFraction : null
  const u = rem !== null ? Math.round((1 - rem) * 100) : null
  const resetsAt = typeof bucket?.resetTime === 'string' ? bucket.resetTime : typeof bucket?.resetsAt === 'string' ? bucket.resetsAt : null
  const limitReached = bucket?.remainingFraction === 0
  return {
    window: w,
    usedPercent: u,
    resetsAt,
    checkedAt: chk,
    limitReached,
    source: 'antigravity'
  }
}
