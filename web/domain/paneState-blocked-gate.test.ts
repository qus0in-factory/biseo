import test from 'node:test'
import assert from 'node:assert/strict'
import { canInputTarget, getPaneState } from './paneState.js'

test('blocked and unknown target are blocked', () => {
  const b = { paneId: 'p', name: 'P', status: 'blocked' as const, sendable: false, disabledReason: 'agent_blocked' as const }
  assert.equal(canInputTarget(b), false)
  assert.deepEqual(getPaneState(b), { ok: false, reason: 'agent_blocked' })

  const u = { paneId: 'p', name: 'P', status: 'unknown' as const, sendable: false, disabledReason: 'agent_unknown' as const }
  assert.equal(canInputTarget(u), false)
  assert.deepEqual(getPaneState(u), { ok: false, reason: 'agent_unknown' })
})
