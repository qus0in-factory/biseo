import test from 'node:test'
import assert from 'node:assert/strict'
import { interruptPane } from './interrupt-pane.js'
import { setup } from './interrupt-pane-setup-fixture.test.js'

test('only blocked panes are interrupted; working, idle, done, unknown are rejected', async () => {
  for (const status of ['working', 'idle', 'done', 'unknown'] as const) {
    let sends = 0
    const { deps, logs } = setup({ status, send: async () => { sends += 1 } })
    const r = await interruptPane(deps, 'w:p1', 'esc')
    assert.equal(r.status, 409, status)
    assert.deepEqual(r.body, { error: 'target_not_ready', reason: 'pane_not_blocked' }, status)
    assert.equal(sends, 0, status)
    assert.equal(logs[0]?.result, 'not_blocked', status)
  }
})
