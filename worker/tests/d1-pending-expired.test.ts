import assert from 'node:assert/strict'
import test from 'node:test'
import { createFakeD1 } from './fake-d1.js'
import { insertRow } from './d1-row.js'
import { pendingTurns } from '../infra/d1-timeline-pending.js'

test('expired timeout is excluded from cron pending; live timeout stays', async () => {
  const db = createFakeD1()
  await insertRow(db, 'live', 'owner', 'w1T', 'timeout', 'turn_timeout')
  await insertRow(db, 'expired', 'owner', 'w1T', 'timeout', 'late_capture_expired')
  await insertRow(db, 'working', 'owner', 'w1T', 'working')
  await insertRow(db, 'done', 'owner', 'w1T', 'completed')
  const rows = await pendingTurns(db, 'w1T', 10)
  assert.deepEqual(rows.map((r) => r.requestId), ['live', 'working'])
})
