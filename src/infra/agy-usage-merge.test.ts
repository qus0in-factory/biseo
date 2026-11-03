import test from 'node:test'
import assert from 'node:assert/strict'
import { modelBucketsToGroups } from './agy-quota-models.js'
import { mergeAgyGroups } from './agy-usage-merge.js'
import { parseAgyUsage } from './agy-usage-parse.js'

const g = (n: string, r: number, families?: string[]) =>
  ({ displayName: n, buckets: [{ bucketId: 'weekly', remainingFraction: r }], families })
const at = new Date('2026-10-30T10:00:00Z')
const rst = '2026-11-07T00:00:00.000Z'

test('summary groups win, derived fill missing families', () => {
  const summary = [g('Gemini Models', 0)]
  const merged = mergeAgyGroups(summary, [g('Gemini Models', 0.3), g('Gemini 4 Argon', 1)])
  assert.equal(merged.length, 2)
  assert.equal(merged[0], summary[0])
  assert.equal(merged[1].displayName, 'Gemini 4 Argon')
})

test('summary Argon beats derived Argon', () => {
  const summary = [g('Gemini 4 Argon', 0.2)]
  const merged = mergeAgyGroups(summary, [g('Gemini 4 Argon', 1)])
  assert.equal(merged.length, 1)
  assert.equal(merged[0], summary[0])
})

test('derived duplicates collapse', () => {
  const merged = mergeAgyGroups([], [g('Gemini Models', 0.3), g('Gemini Models', 0.1)])
  assert.equal(merged.length, 1)
  assert.equal(merged[0].buckets[0].remainingFraction, 0.3)
})

test('bucketId argon groups with reset', () => {
  const g = modelBucketsToGroups([{ bucketId: 'gemini-argon-wtu-weekly', remainingFraction: 0, resetTime: rst }])
  assert.equal(g.length, 1)
  assert.equal(g[0].displayName, 'Gemini 4 Argon')
  assert.deepEqual(g[0].families, ['argon'])
  assert.equal(g[0].buckets[0].resetTime, rst)
})

test('summary weekly backfills', () => {
  const s = [{ displayName: 'Gemini 4 Argon', buckets: [{ bucketId: 'weekly', remainingFraction: 0 }] } as any]
  const d = modelBucketsToGroups([{ bucketId: 'gemini-argon-wtu-weekly', remainingFraction: 0, resetTime: rst }])
  const res = parseAgyUsage({ groups: mergeAgyGroups(s, d) }, at)
  const m = res.metrics.find((x) => x.id.startsWith('argon:'))
  assert.ok(m)
  assert.equal(m?.resetsAt, rst)
})

test('a summary pool inherits the detected families', () => {
  const merged = mergeAgyGroups([g('Claude and GPT models', 0)], [g('Claude and GPT models', 0.3, ['claude', 'gpt'])])
  assert.deepEqual(merged[0].families, ['claude', 'gpt'])
})

test('a pool without a quota match stays unknown', () => {
  assert.deepEqual(mergeAgyGroups([g('Mystery Pool', 0)], [])[0].families, ['unknown'])
})
