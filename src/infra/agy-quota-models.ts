import type { AgyBucket, AgyGroup } from './agy-quota-types.js'
import { quotaGroup } from './agy-quota-group.js'
import { quotaPool } from './agy-quota-pools.js'
import { modelFamily } from './agy-model-family.js'

// Identifier may arrive in bucketId when modelId is absent.
const id = (b: AgyBucket): string =>
  (typeof b.modelId === 'string' ? b.modelId : b.bucketId) as string

export function modelBucketsToGroups(buckets: AgyBucket[]): AgyGroup[] {
  if (!Array.isArray(buckets)) return []
  const known = buckets.filter((b) =>
    typeof id(b) === 'string' && typeof b.remainingFraction === 'number' && quotaPool(id(b)))
  const names = [...new Set(known.map((b) => quotaPool(id(b)) as string))]
  return names.map((n) => {
    const mine = known.filter((b) => quotaPool(id(b)) === n)
    const fams = [...new Set(mine.map((b) => modelFamily(id(b))))]
    return { ...quotaGroup(n, mine), families: fams }
  })
}
