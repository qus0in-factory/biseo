import test from 'node:test'
import assert from 'node:assert/strict'
import { markOffline } from './markOffline.js'
import type { PaneSummary } from './timeline.js'

test('markOffline disables all panes and sets reason to connection_unavailable', () => {
  const panes: PaneSummary[] = [
    {
      paneId: 'p1',
      name: 'P1',
      status: 'idle',
      sendable: true,
      disabledReason: null,
    },
    {
      paneId: 'p2',
      name: 'P2',
      status: 'working',
      sendable: false,
      disabledReason: 'agent_busy',
    },
  ]
  const updated = markOffline(panes)
  assert.equal(updated.length, 2)
  assert.equal(updated[0].sendable, false)
  assert.equal(updated[0].disabledReason, 'connection_unavailable')
  assert.equal(updated[1].sendable, false)
  assert.equal(updated[1].disabledReason, 'connection_unavailable')
})
