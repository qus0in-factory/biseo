import type { AgyBucket, AgyGroup } from './agy-quota-types.js'

const hidden = /lite|image|thinking|^tab_/

export function quotaGroup(name: string, all: AgyBucket[]): AgyGroup {
  const vis = all.filter((b) => !hidden.test((b.modelId ?? b.bucketId) ?? ''))
  const use = vis.length > 0 ? vis : all
  return {
    displayName: name,
    buckets: [{
      bucketId: 'weekly',
      displayName: 'Weekly Limit Remaining',
      window: 'weekly',
      remainingFraction: Math.min(...use.map((b) => b.remainingFraction as number)),
      resetTime: use.find((b) => typeof b.resetTime === 'string')?.resetTime ?? null
    }]
  }
}
