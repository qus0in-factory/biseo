import test from 'node:test'
import assert from 'node:assert/strict'
import { beginFirstReader } from './first-session-reader.js'
import { herdStub, noSes, noSub, pane, session } from './test-util/first-session-fixture.js'
import { captureTurn } from './capture-turn.js'
import { TurnStore } from './turn-store.js'
import { captureHerdr, captureItem } from './test-util/first-session-capture-fixture.js'
import { withSessionDb } from './test-util/first-session-db-fixture.js'

{

const base = { pane_id: 'w:p1', terminal_id: 'term', agent_status: 'idle', agent: 'opencode' }

test('no session, replaced pane, other agent all throw', async () => {
  const w = beginFirstReader({ herdr: herdStub({ pane: { ...base } }) as never, firstSessionMs: 20, sub: noSub }, noSes, 'hi')!
  await assert.rejects(w.read(500))
  const x = beginFirstReader({ herdr: herdStub({ pane: { ...base, terminal_id: 'other' } }) as never, firstSessionMs: 20, sub: noSub }, noSes, 'hi')!
  await assert.rejects(x.read(500))
  const y = beginFirstReader({ herdr: herdStub({ pane: { ...base, agent: 'claude' } }) as never, firstSessionMs: 20, sub: noSub }, noSes, 'hi')!
  await assert.rejects(y.read(500))
})
}
{

test('missing session ends capture_unavailable with one prompt', async () => {
  const t = { pane }
  let n = 0
  const herdr = captureHerdr(() => { n++ })
  const store = new TurnStore()
  store.add({ ...captureItem })
  const r = beginFirstReader({ herdr: herdr as never, firstSessionMs: 20, sub: noSub }, t, 'hi')!
  await captureTurn({ herdr: herdr as never, store, timeoutMs: 500, lateCaptureMs: 0 }, captureItem, r)
  assert.equal(store.get('r1')?.status, 'capture_unavailable')
  assert.equal(store.get('r1')?.errorCode, 'response_capture_unavailable')
  assert.equal(n, 1)
})
}
{

test('first reader collects rows written before session report', async () => {
  await withSessionDb(async () => {
    const ses = session('ses_9')
    const full = { pane_id: 'w:p1', terminal_id: 'term', agent_status: 'idle', agent: 'opencode', agent_session: ses }
    const herdr = herdStub({ pane: full })
    let subCalls = 0
    const sub = async () => () => { subCalls++ }
    const r = beginFirstReader({ herdr: herdr as never, firstSessionMs: 50, sub }, noSes, 'hi')!
    assert.equal(await r.read(1000), 'ok')
    assert.equal(subCalls, 0)
  })
})
}
