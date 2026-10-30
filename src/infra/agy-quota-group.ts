import type { AgyBucket, AgyGroup } from './agy-quota-types.js'

const hidden = /lite|image|thinking|^tab_/
const rt = (b: any): string | null =>
  typeof b?.resetTime === 'string' ? b.resetTime : typeof b?.resetsAt === 'string' ? b.resetsAt : null

export function quotaGroup(name: string, all: AgyBucket[]): AgyGroup {
  const vis = all.filter((b) => !hidden.test(b.modelId ?? ''))
  const use = vis.length > 0 ? vis : all
  return {
    displayName: name,
    buckets: [{
      bucketId: 'weekly',
      displayName: 'Weekly Limit Remaining',
      window: 'weekly',
      remainingFraction: Math.min(...use.map((b) => b.remainingFraction as number)),
      resetTime: use.map(rt).find((s): s is string => typeof s === 'string') ?? null
    }]
  }
}
