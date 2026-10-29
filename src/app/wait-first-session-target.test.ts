import test from 'node:test'
import assert from 'node:assert/strict'
import { waitFirstSession } from './wait-first-session.js'
import { mkSub } from './wait-first-session-fixture.test.js'

test('replaced pane and other agent stop without events', async () => {
  const h = { getPane: async () => ({ pane_id: 'w:p1', terminal_id: 'other' }), getAgent: async () => undefined } as never
  const { sub, r } = mkSub()
  assert.equal(await waitFirstSession(h, 'w:p1', 'term', 50, () => false, sub), null)
  assert.equal(r.ids.length, 0)
  const h2 = { getPane: async () => ({ pane_id: 'w:p1', terminal_id: 'term', agent: 'claude' }), getAgent: async () => undefined } as never
  assert.equal(await waitFirstSession(h2, 'w:p1', 'term', 50, () => false, sub), null)
})
