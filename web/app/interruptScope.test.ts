import test from 'node:test'
import assert from 'node:assert/strict'
import { makeScope } from './interruptScope'
import { runScope } from './interruptScope'
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
{
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
}
{
const a: PaneSummary = { paneId: 'pA', name: 'A', status: 'blocked', sendable: false, disabledReason: 'agent_blocked' }
test('unmount ignores late response', async () => {
  const s = makeScope()
  let res!: (v: { ok: true; status: number }) => void
  const p = new Promise<{ ok: true; status: number }>((r) => { res = r })
  const send = async () => p
  let msg: string | null = null
  const q = runScope(s, a, true, send, () => true, (m) => { msg = m }, () => {})
  s.live = false
  res({ ok: true, status: 200 })
  await q
  assert.equal(msg, null)
})
}
