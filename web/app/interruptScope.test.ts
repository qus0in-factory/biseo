import test from 'node:test'
import assert from 'node:assert/strict'
import { makeScope, runScope } from './interruptScope'
import type { PaneSummary } from '../domain/timeline'
const a: PaneSummary = { paneId: 'pA', name: 'A', status: 'blocked', sendable: false, disabledReason: 'agent_blocked' }
test('inflight duplicate blocked', async () => {
  const s = makeScope()
  let c = 0
  let res!: (v: { ok: true; status: number }) => void
  const p = new Promise<{ ok: true; status: number }>((r) => { res = r })
  const send = async () => { c++; return p }
  let msg: string | null = null
  let busy = false
  const p1 = runScope(s, a, true, send, () => true, (m) => { msg = m }, (v) => { busy = v })
  const p2 = runScope(s, a, true, send, () => true, (m) => { msg = m }, (v) => { busy = v })
  res({ ok: true, status: 200 })
  await Promise.all([p1, p2])
  assert.equal(c, 1)
  assert.match(msg ?? '', /신호/)
  assert.equal(busy, false)
})
