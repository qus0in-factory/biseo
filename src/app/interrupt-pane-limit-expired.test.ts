import test from 'node:test'
import assert from 'node:assert/strict'
import { interruptPane } from './interrupt-pane.js'
import { limited } from './interrupt-pane-fixture.test.js'
import { setup } from './interrupt-pane-setup-fixture.test.js'

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
