import test from 'node:test'
import { createFakeD1 } from './fake-d1.js'
import { parseUsage } from '../app/usage-sync.js'
import { upsertUsage } from '../infra/d1-usage-write.js'
import { listUsage } from '../infra/d1-usage-read.js'
import { groupUsage } from '../app/usage-group.js'
import { initialStaleReport, authStaleReport } from './d1-usage-stale-fixtures.js'
import { assertPreserved } from './d1-usage-stale-assert.js'

test('D1 save preserves % and reset when auth_required has no values', async () => {
  const db = createFakeD1()
  await upsertUsage(db, parseUsage(initialStaleReport))
  await upsertUsage(db, parseUsage(authStaleReport))
  const g = groupUsage(await listUsage(db))
  assertPreserved(g.find(p => p.provider === 'codex')!, g.find(p => p.provider === 'grok')!)
})
