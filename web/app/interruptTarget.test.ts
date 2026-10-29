import test from 'node:test'
import assert from 'node:assert/strict'
import { makeScope, runScope } from './interruptScope'
import type { PaneSummary } from '../domain/timeline'
const a: PaneSummary = { paneId: 'pA', name: 'A', status: 'blocked', sendable: false, disabledReason: 'agent_blocked' }
const b: PaneSummary = { paneId: 'pB', name: 'B', status: 'blocked', sendable: false, disabledReason: 'agent_blocked' }
test('A result ignored after B selected', async () => {
  const s = makeScope()
  let res!: (v: { ok: true; status: number }) => void
  const p = new Promise<{ ok: true; status: number }>((r) => { res = r })
  let c = 0
  const send = async () => { c++; return p }
  let msg: string | null = null
  const q = runScope(s, a, true, send, () => true, (m) => { msg = m }, () => {})
  s.cur = b.paneId
  res({ ok: true, status: 200 })
  await q
  assert.equal(c, 1)
  assert.equal(msg, null)
})
