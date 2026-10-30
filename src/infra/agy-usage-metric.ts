import type { UsageMetric } from '../domain/usage-types.js'
import { familyKey } from './agy-model-family.js'

export function makeAgyMetric(groupName: string, b: any, families: readonly string[] = []): UsageMetric {
  const rem = typeof b?.remainingFraction === 'number' ? b.remainingFraction : null
  const used = rem !== null ? Math.round((1 - rem) * 100) : null
  const resetsAt = typeof b?.resetTime === 'string' ? b.resetTime : typeof b?.resetsAt === 'string' ? b.resetsAt : null
  // The id head carries the model family key so the web can label the family by key only.
  const raw = b?.bucketId ? `${groupName}:${b.bucketId}` : (b?.displayName ?? 'metric')
  const id = `${familyKey(families)}:${raw}`
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
