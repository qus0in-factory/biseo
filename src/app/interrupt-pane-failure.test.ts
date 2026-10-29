import test from 'node:test'
import assert from 'node:assert/strict'
import { interruptPane } from './interrupt-pane.js'
import { setup } from './interrupt-pane-setup-fixture.js'

test('invalid keys and send failures are audited', async () => {
  const { deps, logs } = setup({ send: async () => Promise.reject(new Error('down')) })
  const bad = await interruptPane(deps, 'w:p1', 'return')
  assert.equal(bad.status, 400)
  const failed = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(failed.status, 502)
  assert.deepEqual(logs.map((x) => x.result), ['invalid', 'failed'])
})
