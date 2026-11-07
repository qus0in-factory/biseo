import type { AgyBucket, AgyGroup } from './agy-quota-types.js'
import { bucketWindow, type AgyWin } from './agy-quota-window.js'

const hide = /lite|image|thinking|^tab_/

// One summary per window so weekly and 5h values never mix.
const sum = (w: AgyWin, use: AgyBucket[]): AgyBucket => ({
  bucketId: w,
  displayName: w === 'weekly' ? 'Weekly Limit Remaining' : 'Five Hour Limit Remaining',
  window: w,
  remainingFraction: Math.min(...use.map((b) => b.remainingFraction as number)),
  resetTime: use.find((b) => typeof b.resetTime === 'string')?.resetTime ?? null
})

export function quotaGroup(name: string, all: AgyBucket[]): AgyGroup {
  const vis = all.filter((b) => !hide.test(b.modelId ?? b.bucketId ?? ''))
  const use = vis.length > 0 ? vis : all
  const by = (w: AgyWin) => use.filter((b) => bucketWindow(b) === w)
  const wins = (['5h', 'weekly'] as AgyWin[]).filter((w) => by(w).length > 0)
  return { displayName: name, buckets: wins.map((w) => sum(w, by(w))) }
}
