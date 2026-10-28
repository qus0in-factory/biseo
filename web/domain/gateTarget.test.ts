import test from 'node:test'
import assert from 'node:assert/strict'
import { gateTarget } from './gateTarget.js'
import type { PaneSummary } from './timeline.js'

test('gateTarget disables sendability when offline', () => {
  const pane: PaneSummary = {
    paneId: 'p1',
    name: 'P1',
    status: 'idle',
    sendable: true,
    disabledReason: null,
  }

  const onlineTarget = gateTarget(pane, true)
  assert.equal(onlineTarget?.sendable, true)
  assert.equal(onlineTarget?.disabledReason, null)

  const offlineTarget = gateTarget(pane, false)
  assert.equal(offlineTarget?.sendable, false)
  assert.equal(offlineTarget?.disabledReason, 'connection_unavailable')

  assert.equal(gateTarget(undefined, true), undefined)
})
