import type { UsageMetric } from '../domain/usage-types.js'

export function makeAgyMetric(groupName: string, b: any): UsageMetric {
  const rem = typeof b?.remainingFraction === 'number' ? b.remainingFraction : null
  const used = rem !== null ? Math.round((1 - rem) * 100) : null
  const resetsAt = typeof b?.resetTime === 'string' ? b.resetTime : null
  const id = b?.bucketId ? `${groupName}:${b.bucketId}` : (b?.displayName ?? 'metric')
  const label = b?.displayName ? `${groupName} - ${b.displayName}` : id
  return {
    id,
    label,
    unit: 'percent',
    used,
    limit: 100,
    remaining: rem !== null ? Math.round(rem * 100) : null,
    resetsAt
  }
}
