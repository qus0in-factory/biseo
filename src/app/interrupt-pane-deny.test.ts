import test from 'node:test'
import assert from 'node:assert/strict'
import { interruptPane } from './interrupt-pane.js'
import { setup } from './interrupt-pane-setup-fixture.test.js'

test('opencode Ctrl+C is rejected and never sent', async () => {
  let sent = false
  const { deps, logs } = setup({ agent: 'opencode', send: async () => { sent = true } })
  const r = await interruptPane(deps, 'w:p1', 'ctrl+c')
  assert.equal(r.status, 400)
  assert.equal((r.body as Record<string, unknown>).reason, 'key_not_allowed')
  assert.equal(sent, false)
  assert.equal(logs[0]?.result, 'denied')
})
