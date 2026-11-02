import test from 'node:test'
import assert from 'node:assert/strict'
import { canInputTarget, isQueuedTarget, getPaneState } from './paneState.js'
import { getPaneReason } from '../ui/paneMetaReason.js'

test('working and done states allow input and reservation', () => {
  const w = { paneId: 'p', name: 'P', status: 'working' as const, sendable: false, disabledReason: 'agent_busy' as const }
  assert.equal(canInputTarget(w), true)
  assert.equal(isQueuedTarget(w), true)
  assert.deepEqual(getPaneState(w), { ok: true, reason: null })

  const d = { paneId: 'p', name: 'P', status: 'done' as const, sendable: true, disabledReason: null }
  assert.equal(canInputTarget(d), true)
  assert.equal(isQueuedTarget(d), false)
  assert.deepEqual(getPaneState(d), { ok: true, reason: null })
  assert.equal(getPaneReason('agent_busy'), null)
})
