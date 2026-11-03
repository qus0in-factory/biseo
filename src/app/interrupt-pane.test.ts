import test from 'node:test'
import assert from 'node:assert/strict'
import { interruptPane } from './interrupt-pane.js'
import { setup } from './test-util/interrupt-pane-setup-fixture.js'
import { limited } from './test-util/interrupt-pane-fixture.js'

test('default Esc interrupt is sent once to a blocked pane and audited', async () => {
  let sent: [string, string] | null = null
  const { deps, logs } = setup({ send: async (id, key) => { sent = [id, key] } })
  const r = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(r.status, 200)
  assert.deepEqual(r.body, { paneId: 'w:p1', key: 'esc', status: 'sent' })
  assert.deepEqual(sent, ['w:p1', 'esc'])
  assert.deepEqual(logs, [{ paneId: 'w:p1', key: 'esc', result: 'sent' }])
})

{

test('opencode Ctrl+C is rejected and never sent', async () => {
  let sent = false
  const { deps, logs } = setup({ agent: 'opencode', send: async () => { sent = true } })
  const r = await interruptPane(deps, 'w:p1', 'ctrl+c')
  assert.equal(r.status, 400)
  assert.equal((r.body as Record<string, unknown>).reason, 'key_not_allowed')
  assert.equal(sent, false)
  assert.equal(logs[0]?.result, 'denied')
})
}
{

test('invalid keys and send failures are audited', async () => {
  const { deps, logs } = setup({ send: async () => Promise.reject(new Error('down')) })
  const bad = await interruptPane(deps, 'w:p1', 'return')
  assert.equal(bad.status, 400)
  const failed = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(failed.status, 502)
  assert.deepEqual(logs.map((x) => x.result), ['invalid', 'failed'])
})
}
{

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
}
{

test('expired usage limits allow a blocked pane to be interrupted', async () => {
  let sent = false
  const { deps, logs } = setup({ send: async () => { sent = true } })
  deps.availability = {
    get: async () => ({ ...limited, resetsAt: new Date(Date.now() - 1000).toISOString() }),
  }
  const r = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(r.status, 200)
  assert.equal(sent, true)
  assert.equal(logs[0]?.result, 'sent')
})
}
{

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
}
{

test('pane lookup is restricted to the allowed workspace and known panes', async () => {
  const { deps } = setup({ workspace: 'other' })
  const r = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(r.status, 403)
  deps.herdr.getPane = async () => undefined
  const missing = await interruptPane(deps, 'w:none', 'esc')
  assert.equal(missing.status, 404)
})
}
