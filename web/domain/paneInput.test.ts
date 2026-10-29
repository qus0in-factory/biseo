import test from 'node:test'
import assert from 'node:assert/strict'
import { canInputTarget, isQueuedTarget } from './paneState.js'

test('canInputTarget and isQueuedTarget allow busy reservation', () => {
  const busy = { paneId: 'p', name: 'P', status: 'working' as const, sendable: false, disabledReason: 'agent_busy' as const }
  assert.equal(canInputTarget(busy), true)
  assert.equal(isQueuedTarget(busy), true)

  const unsupp = { paneId: 'p', name: 'P', status: 'idle' as const, sendable: false, disabledReason: 'response_capture_unavailable' as const }
  assert.equal(canInputTarget(unsupp), false)
  assert.equal(isQueuedTarget(unsupp), false)
})
