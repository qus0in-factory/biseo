import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-data-fixture.js'

test('unknown or failing availability keeps execution gating intact', async () => {
  const s = await availabilitySummaries(
    [pane],
    [agent],
    new PaneLocks(),
    { get: async () => Promise.reject(new Error('read failed')) },
  )
  assert.equal(s[0].sendable, true)
  assert.equal(s[0].disabledReason, null)
  assert.equal(s[0].availability.state, 'unknown')
})
