import test from 'node:test'
import assert from 'node:assert/strict'
import { triggerInterrupt } from './interruptAction'
import type { PaneSummary } from '../domain/timeline'

const b: PaneSummary = {
  paneId: 'p1', name: 'P1', status: 'blocked', sendable: false, disabledReason: 'agent_blocked',
}

test('interrupt 1 call on confirm & status messages', async () => {
  let c = 0
  const ok = async () => { c++; return { ok: true as const, status: 200 } }
  const r1 = await triggerInterrupt(b, true, false, ok, () => true)
  assert.equal(c, 1)
  assert.match(r1.message ?? '', /신호/)

  const cf = async () => ({ ok: false as const, status: 409, conflict: true })
  const r2 = await triggerInterrupt(b, true, false, cf, () => true)
  assert.match(r2.message ?? '', /해제/)

  const fl = async () => ({ ok: false as const, status: 500, conflict: false })
  const r3 = await triggerInterrupt(b, true, false, fl, () => true)
  assert.match(r3.message ?? '', /실패/)
})
