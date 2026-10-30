import test from 'node:test'
import assert from 'node:assert/strict'
import { canInterrupt } from '../domain/interrupt'
import type { PaneSummary } from '../domain/timeline'

test('SSE update handles unblocked transition without optimistic mutation', () => {
  const current: PaneSummary = {
    paneId: 'p1',
    name: 'P1',
    status: 'blocked',
    sendable: false,
    disabledReason: 'agent_blocked',
    blockedReason: 'input_request',
  }
  assert.equal(canInterrupt(current), true)

  // optimistic update is NOT applied: current remains blocked
  assert.equal(current.status, 'blocked')

  // SSE event arrives from server
  const sseUpdated: PaneSummary = {
    ...current,
    status: 'idle',
    sendable: true,
    disabledReason: null,
    blockedReason: null,
  }
  assert.equal(canInterrupt(sseUpdated), false)
  assert.equal(sseUpdated.sendable, true)
})
