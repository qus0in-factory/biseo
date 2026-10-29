import test from 'node:test'
import assert from 'node:assert/strict'
import { waitFirstSession } from './wait-first-session.js'
import { mk, mkSub, tick } from './wait-first-session-fixture.test.js'

test('pre-start cancel never subscribes; socket close ends wait', async () => {
  const { h } = mk(() => undefined)
  const { sub, r } = mkSub()
  assert.equal(await waitFirstSession(h, 'w:p1', 'term', 50, () => true, sub), null)
  assert.equal(r.ids.length, 0)
  const { h: h2 } = mk(() => undefined)
  const { sub: s2, r: r2 } = mkSub()
  const p = waitFirstSession(h2, 'w:p1', 'term', 500, () => false, s2)
  await tick()
  r2.cl.forEach((f) => f())
  assert.equal(await p, null)
  assert.equal(r2.un, 1)
})
