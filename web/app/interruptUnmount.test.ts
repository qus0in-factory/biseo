import test from 'node:test'
import assert from 'node:assert/strict'
import { makeScope, runScope } from './interruptScope'
import type { PaneSummary } from '../domain/timeline'
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
