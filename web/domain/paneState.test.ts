import test from 'node:test'
import assert from 'node:assert/strict'
import { getPaneState } from './paneState.js'

test('getPaneState checks sendability and fallback reasons', () => {
  assert.deepEqual(getPaneState(undefined), { ok: false, reason: 'target_not_found' })
  assert.deepEqual(
    getPaneState({ paneId: 'p1', name: 'P1', status: 'idle', sendable: true, disabledReason: null }),
    { ok: true, reason: null },
  )
  assert.deepEqual(
    getPaneState({ paneId: 'p1', name: 'P1', status: 'blocked', sendable: false, disabledReason: 'agent_blocked' }),
    { ok: false, reason: 'agent_blocked' },
  )
})
