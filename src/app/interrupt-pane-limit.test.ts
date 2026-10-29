import test from 'node:test'
import assert from 'node:assert/strict'
import { interruptPane } from './interrupt-pane.js'
import { limited } from './interrupt-pane-fixture.js'
import { setup } from './interrupt-pane-setup-fixture.js'

test('confirmed usage limits block blocked and non-blocked panes before the status guard', async () => {
  for (const status of ['blocked', 'idle'] as const) {
    let sends = 0
    const { deps, logs } = setup({ status, send: async () => { sends += 1 } })
    deps.availability = { get: async () => limited }
    const r = await interruptPane(deps, 'w:p1', 'esc')
    assert.equal(r.status, 409, status)
    assert.deepEqual(r.body, {
      error: 'target_not_ready',
      reason: 'usage_limited',
      resetsAt: limited.resetsAt,
    }, status)
    assert.equal(sends, 0, status)
    assert.equal(logs[0]?.result, 'limited', status)
  }
})
