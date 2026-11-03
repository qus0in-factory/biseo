import test from 'node:test'
import assert from 'node:assert/strict'
import { createFakeD1 } from '../test-util/fake-d1.js'
import { parseUsage } from '../app/usage-sync.js'
import { upsertUsage } from '../infra/d1-usage-write.js'
import { listUsage } from '../infra/d1-usage-read.js'
import { groupUsage } from '../app/usage-group.js'
import { initialStaleReport, authStaleReport } from '../test-util/d1-usage-stale-fixtures.js'
import { assertPreserved } from '../test-util/d1-usage-stale-assert.js'

test('D1 save preserves % and reset when auth_required has no values', async () => {
  const db = createFakeD1()
  await upsertUsage(db, parseUsage(initialStaleReport))
  await upsertUsage(db, parseUsage(authStaleReport))
  const g = groupUsage(await listUsage(db))
  assertPreserved(g.find(p => p.provider === 'codex')!, g.find(p => p.provider === 'grok')!)
})

test('balance period and nullable currency fields survive D1', async () => {
  const metric = { id: 'purchased_balance', unit: 'currency', used: null, limit: null, remaining: 7, startsAt: '2026-10-01', resetsAt: '2026-11-01' }
  const db = createFakeD1()
  await upsertUsage(db, parseUsage({ providers: [{ provider: 'ollama', state: 'available', metrics: [metric] }] }))
  const [actual] = groupUsage(await listUsage(db))[0].metrics
  assert.equal(actual.remaining, 7)
  assert.equal(actual.limit, null)
  assert.equal(actual.used, null)
  assert.equal(actual.startsAt, metric.startsAt)
  assert.equal(actual.resetsAt, metric.resetsAt)
})
