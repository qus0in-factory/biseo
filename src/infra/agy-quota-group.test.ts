import test from 'node:test'
import assert from 'node:assert/strict'
import { modelBucketsToGroups } from './agy-quota-models.js'
import { mergeAgyGroups } from './agy-usage-merge.js'
import { parseAgyUsage } from './agy-usage-parse.js'

test('quotaGroup labels model bucket as 5h and keeps w empty without summary', () => {
  const rst = '2026-11-07T09:46:03Z'
  const w = modelBucketsToGroups([{ bucketId: 'gemini-argon-wtu-weekly', remainingFraction: 0.75 }])
  assert.equal(w[0].buckets[0].window, 'weekly')
  const d = modelBucketsToGroups([{ modelId: 'gemini-2.5-pro', remainingFraction: 0.9, resetTime: rst }])
  const b = d[0].buckets[0]
  assert.equal(b.bucketId, '5h')
  assert.equal(b.window, '5h')
  assert.equal(b.displayName, 'Five Hour Limit Remaining')
  const res = parseAgyUsage({ groups: mergeAgyGroups([], d) }, new Date(rst))
  assert.deepEqual(res.windows.map((x) => [x.window, x.usedPercent]), [['primary', 10]])
  assert.equal(res.metrics[0]?.id, 'gemini:Gemini Models:5h')
})
