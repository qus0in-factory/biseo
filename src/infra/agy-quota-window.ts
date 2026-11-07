import type { AgyBucket } from './agy-quota-types.js'

export type AgyWin = '5h' | 'weekly'

// Quota buckets whose identifiers lack "week" are treated as 5h. Basis: #231
// field check (docs/ops/current-operations.md, "AGY 조사와 한계").
export const bucketWindow = (b: AgyBucket): AgyWin =>
  /week/i.test([b.modelId, b.bucketId, b.window].join(' ')) ? 'weekly' : '5h'
