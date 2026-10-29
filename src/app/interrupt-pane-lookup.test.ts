import test from 'node:test'
import assert from 'node:assert/strict'
import { interruptPane } from './interrupt-pane.js'
import { setup } from './interrupt-pane-setup-fixture.test.js'

test('pane lookup is restricted to the allowed workspace and known panes', async () => {
  const { deps } = setup({ workspace: 'other' })
  const r = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(r.status, 403)
  deps.herdr.getPane = async () => undefined
  const missing = await interruptPane(deps, 'w:none', 'esc')
  assert.equal(missing.status, 404)
})
