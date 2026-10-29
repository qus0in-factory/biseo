import test from 'node:test'
import assert from 'node:assert/strict'
import { waitFirstSession } from './wait-first-session.js'
import { mk, mkSub, tick } from './wait-first-session-fixture.test.js'

test('timeout ends wait, unsubscribes, never polls', async () => {
  const { h, reads } = mk(() => undefined)
  const { sub, r } = mkSub()
  assert.equal(await waitFirstSession(h, 'w:p1', 'term', 30, () => false, sub), null)
  assert.equal(r.un, 1)
  assert.equal(reads(), 2)
  await tick(60)
  assert.equal(reads(), 2)
})
