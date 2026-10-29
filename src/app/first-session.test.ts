import test from 'node:test'
import assert from 'node:assert/strict'
import { beginReader } from './turn-queue-target.js'
import { pane, session } from './first-session-fixture.js'
import { ag, deps } from './first-session-deps-fixture.js'

const input = { requestId: 'r1', workspaceId: 'w', paneId: 'w:p1', text: 'hi' }

test('first send allowed only for opencode without session', async () => {
  const t = { pane }
  assert.notEqual(await beginReader(deps(async () => null), input, t), null)
  const c = { pane: { ...pane, agent: 'claude' }, agent: ag('claude', undefined) }
  assert.equal(await beginReader(deps(async () => null), input, c), null)
  let n = 0
  const e = { pane, agent: ag('opencode', session('ses_1')) }
  const r = await beginReader(deps(async () => { n++; return { read: async () => 'x' } }), input, e)
  assert.notEqual(r, null)
  assert.equal(n, 1)
})
