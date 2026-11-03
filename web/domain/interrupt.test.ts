import test from 'node:test'
import assert from 'node:assert/strict'
import { canInterrupt } from './interrupt'
import type { PaneSummary } from './timeline'
import { INTERRUPT_KEY } from './interrupt'
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
const base: PaneSummary = {
  paneId: 'p1',
  name: 'P1',
  status: 'blocked',
  sendable: false,
  disabledReason: 'agent_blocked',
}

test('canInterrupt checks blocked, offline, inflight, limited', () => {
  assert.equal(INTERRUPT_KEY, 'esc')
  assert.equal(canInterrupt(undefined), false)
  assert.equal(canInterrupt({ ...base, status: 'idle' }), false)
  assert.equal(canInterrupt(base), true)
  assert.equal(canInterrupt(base, false), false)
  assert.equal(canInterrupt(base, true, true), false)
  assert.equal(canInterrupt({ ...base, blockedReason: 'usage_limit' }), false)
  assert.equal(canInterrupt({ ...base, blockedReason: 'usage_limit', usageLimitSuspected: true }), true)
  assert.equal(canInterrupt({ ...base, blockedReason: 'unknown' }), true)
  assert.equal(canInterrupt({ ...base, blockedReason: 'input_request' }), true)
})
