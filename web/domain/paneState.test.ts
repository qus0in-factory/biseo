import test from 'node:test'
import assert from 'node:assert/strict'
import r from '../resources.json'
import { canInputTarget } from './paneState.js'
import { isQueuedTarget } from './paneState.js'
import { getPaneState } from './paneState.js'
import { getPaneReason } from '../ui/paneMetaReason.js'

test('resources define reservation, cancellation, and prompt reject', () => {
  const s = r as Record<string, string>
  assert.equal(s.turn_queued, '예약됨')
  assert.equal(s.turn_cancelled, '취소됨')
  assert.equal(s.cancel, '취소')
  assert.equal(s.reserveSend, '전송 예약')
  assert.match(s.prompt_not_accepted, /전달되지 않음/)
})

test('canInputTarget permits busy reservation and blocks blocked panel', () => {
  const f = (r: any) => ({ paneId: 'p', name: 'P', status: 'idle' as const, sendable: false, disabledReason: r })
  assert.equal(canInputTarget(f('agent_busy')), true)
  assert.equal(isQueuedTarget(f('agent_busy')), true)
  assert.equal(canInputTarget(f('agent_blocked')), false)
  assert.equal(canInputTarget(f('response_capture_unavailable')), false)
})
test('canInputTarget and isQueuedTarget allow busy reservation', () => {
  const busy = { paneId: 'p', name: 'P', status: 'working' as const, sendable: false, disabledReason: 'agent_busy' as const }
  assert.equal(canInputTarget(busy), true)
  assert.equal(isQueuedTarget(busy), true)

  const unsupp = { paneId: 'p', name: 'P', status: 'idle' as const, sendable: false, disabledReason: 'response_capture_unavailable' as const }
  assert.equal(canInputTarget(unsupp), false)
  assert.equal(isQueuedTarget(unsupp), false)
})
test('blocked and unknown target are blocked', () => {
  const b = { paneId: 'p', name: 'P', status: 'blocked' as const, sendable: false, disabledReason: 'agent_blocked' as const }
  assert.equal(canInputTarget(b), false)
  assert.deepEqual(getPaneState(b), { ok: false, reason: 'agent_blocked' })

  const u = { paneId: 'p', name: 'P', status: 'unknown' as const, sendable: false, disabledReason: 'agent_unknown' as const }
  assert.equal(canInputTarget(u), false)
  assert.deepEqual(getPaneState(u), { ok: false, reason: 'agent_unknown' })
})
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
