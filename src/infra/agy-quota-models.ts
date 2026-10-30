import type { AgyBucket, AgyGroup } from './agy-quota-types.js'
import { quotaGroup } from './agy-quota-group.js'
import { quotaPool } from './agy-quota-pools.js'
import { modelFamily } from './agy-model-family.js'

// bucketId-only payloads stay ungrouped (no confirmed mapping).
export function modelBucketsToGroups(buckets: AgyBucket[]): AgyGroup[] {
  if (!Array.isArray(buckets)) return []
  const known = buckets.filter((b) =>
    typeof b.modelId === 'string' && typeof b.remainingFraction === 'number' && quotaPool(b.modelId))
  const names = [...new Set(known.map((b) => quotaPool(b.modelId as string) as string))]
  return names.map((n) => {
    const mine = known.filter((b) => quotaPool(b.modelId as string) === n)
    const fams = [...new Set(mine.map((b) => modelFamily(b.modelId as string)))]
    return { ...quotaGroup(n, mine), families: fams }
  })
}
