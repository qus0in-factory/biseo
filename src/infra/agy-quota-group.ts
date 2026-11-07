import type { AgyBucket, AgyGroup } from './agy-quota-types.js'

const hidden = /lite|image|thinking|^tab_/
const isWeekly = (b: AgyBucket) => /week/i.test(`${b.modelId ?? ''} ${b.bucketId ?? ''} ${b.window ?? ''}`)

export function quotaGroup(name: string, all: AgyBucket[]): AgyGroup {
  const vis = all.filter((b) => !hidden.test((b.modelId ?? b.bucketId) ?? ''))
  const use = vis.length > 0 ? vis : all
  const w = use.some(isWeekly) ? 'weekly' : '5h'
  return {
    displayName: name,
    buckets: [{
      bucketId: w,
      displayName: w === 'weekly' ? 'Weekly Limit Remaining' : 'Five Hour Limit Remaining',
      window: w,
      remainingFraction: Math.min(...use.map((b) => b.remainingFraction as number)),
      resetTime: use.find((b) => typeof b.resetTime === 'string')?.resetTime ?? null
    }]
  }
}
