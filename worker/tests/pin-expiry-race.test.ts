import assert from 'node:assert/strict'
import test from 'node:test'
import { createD1PinAttempts } from '../infra/d1-pin-attempts.js'
import { createFakeD1 } from './fake-d1.js'
import { renewOnDelete } from './pin-expiry-db.js'

test('expiry cleanup does not delete a concurrently renewed lock', async () => {
  const db = createFakeD1()
  await db.prepare('INSERT INTO pin_attempts VALUES (?, ?, ?, ?)')
    .bind('ip', 5, 1, 10).run()
  await createD1PinAttempts(renewOnDelete(db)).locked('ip', 20)
  assert.equal(await createD1PinAttempts(db).locked('ip', 20), true)
})
