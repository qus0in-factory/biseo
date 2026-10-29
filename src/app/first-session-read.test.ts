import test from 'node:test'
import assert from 'node:assert/strict'
import { beginFirstReader } from './first-session-reader.js'
import { herdStub, noSes, session } from './first-session-fixture.js'
import { withSessionDb } from './first-session-db-fixture.js'

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
