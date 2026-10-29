import test from 'node:test'
import assert from 'node:assert/strict'
import r from '../resources.json'
import { canInputTarget, isQueuedTarget } from '../domain/paneState.js'

test('resources define reservation, cancellation, and prompt reject', () => {
  const s = r as Record<string, string>
  assert.equal(s.turn_queued, '예약됨')
  assert.equal(s.turn_cancelled, '취소됨')
  assert.equal(s.cancel, '취소')
  assert.equal(s.reserveSend, '전송 예약')
  assert.match(s.prompt_not_accepted, /전달되지 않음/)
})

test('canInputTarget permits busy/blocked panel reservation', () => {
  const f = (r: any) => ({ paneId: 'p', name: 'P', status: 'idle' as const, sendable: false, disabledReason: r })
  assert.equal(canInputTarget(f('agent_busy')), true)
  assert.equal(isQueuedTarget(f('agent_busy')), true)
  assert.equal(canInputTarget(f('agent_blocked')), true)
  assert.equal(canInputTarget(f('response_capture_unavailable')), false)
})
