import test from 'node:test'
import assert from 'node:assert/strict'
import { canInterrupt, INTERRUPT_KEY } from './interrupt'
import type { PaneSummary } from './timeline'

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
  assert.equal(canInterrupt({ ...base, blockedReason: 'unknown' }), true)
  assert.equal(canInterrupt({ ...base, blockedReason: 'input_request' }), true)
})
