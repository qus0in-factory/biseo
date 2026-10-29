import test from 'node:test'
import assert from 'node:assert/strict'
import { waitFirstSession } from './wait-first-session.js'
import type { EventSub } from './first-session-snap.js'
import { mk, ses } from './wait-first-session-fixture.test.js'

test('session reported between first read and subscribe wins without events', async () => {
  let cur: unknown
  const { h } = mk(() => cur)
  let fired = 0
  const sub: EventSub = async () => { cur = ses; return () => { fired++ } }
  assert.deepEqual(await waitFirstSession(h, 'w:p1', 'term', 200, () => false, sub), ses)
  assert.equal(fired, 1)
})
