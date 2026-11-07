import test from 'node:test'
import assert from 'node:assert/strict'
import { createFakeD1 } from '../test-util/fake-d1.js'
import { parseUsage } from '../app/usage-sync.js'
import { upsertUsage } from '../infra/d1-usage-write.js'
import { listUsage } from '../infra/d1-usage-read.js'
import { initialStaleReport } from '../test-util/d1-usage-stale-fixtures.js'

for (const reason of ['auth_required', 'temporarily_unavailable', 'schema_error']) {
  test(`Grok D1 stale ${reason} retains values without available state`, async () => {
    const db = createFakeD1()
    await upsertUsage(db, parseUsage(initialStaleReport))
    await upsertUsage(db, parseUsage({ providers: [{ provider: 'grok', state: 'unknown', reason }] }))
    const row = (await listUsage(db)).find(r => r.provider === 'grok')!
    assert.equal(row.state, 'unknown')
    assert.equal(row.reason, reason)
    assert.ok(row.usedPercent !== null)
  })
}
