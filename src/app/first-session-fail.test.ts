import test from 'node:test'
import assert from 'node:assert/strict'
import { beginFirstReader } from './first-session-reader.js'
import { herdStub, noSes, noSub } from './first-session-fixture.js'

const base = { pane_id: 'w:p1', terminal_id: 'term', agent_status: 'idle', agent: 'opencode' }

test('no session, replaced pane, other agent all throw', async () => {
  const w = beginFirstReader({ herdr: herdStub({ pane: { ...base } }) as never, firstSessionMs: 20, sub: noSub }, noSes, 'hi')!
  await assert.rejects(w.read(500))
  const x = beginFirstReader({ herdr: herdStub({ pane: { ...base, terminal_id: 'other' } }) as never, firstSessionMs: 20, sub: noSub }, noSes, 'hi')!
  await assert.rejects(x.read(500))
  const y = beginFirstReader({ herdr: herdStub({ pane: { ...base, agent: 'claude' } }) as never, firstSessionMs: 20, sub: noSub }, noSes, 'hi')!
  await assert.rejects(y.read(500))
})
