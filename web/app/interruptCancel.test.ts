import test from 'node:test'
import assert from 'node:assert/strict'
import { triggerInterrupt } from './interruptAction'
import type { PaneSummary } from '../domain/timeline'

const base: PaneSummary = {
  paneId: 'p1',
  name: 'P1',
  status: 'blocked',
  sendable: false,
  disabledReason: 'agent_blocked',
}

test('interrupt 0 calls on cancel, offline, limited', async () => {
  let c = 0
  const send = async () => { c++; return { ok: true as const, status: 200 } }
  const r1 = await triggerInterrupt(base, true, false, send, () => false)
  assert.equal(c, 0)
  assert.equal(r1.called, false)

  await triggerInterrupt(base, false, false, send, () => true)
  assert.equal(c, 0)

  const lim = { ...base, blockedReason: 'usage_limit' as const }
  await triggerInterrupt(lim, true, false, send, () => true)
  assert.equal(c, 0)

  await triggerInterrupt(base, true, true, send, () => true)
  assert.equal(c, 0)
})
