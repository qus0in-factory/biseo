import test from 'node:test'
import assert from 'node:assert/strict'
import { waitFirstSession } from './wait-first-session.js'
import { mk, mkSub, ses, tick } from './wait-first-session-fixture.test.js'

test('event resolves session with bounded reads and unsubscribes', async () => {
  let cur: unknown
  const { h, reads } = mk(() => cur)
  const { sub, r } = mkSub()
  const p = waitFirstSession(h, 'w:p1', 'term', 500, () => false, sub)
  await tick()
  assert.equal(reads(), 2)
  assert.deepEqual(r.ids, [['w:p1']])
  cur = ses
  r.ev.forEach((f) => f('agent_status'))
  assert.deepEqual(await p, ses)
  assert.equal(r.un, 1)
  const n = reads()
  r.ev.forEach((f) => f('agent_status'))
  await tick()
  assert.equal(reads(), n)
})
