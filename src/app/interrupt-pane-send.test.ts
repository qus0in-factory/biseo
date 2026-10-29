import test from 'node:test'
import assert from 'node:assert/strict'
import { interruptPane } from './interrupt-pane.js'
import { setup } from './interrupt-pane-setup-fixture.js'

test('default Esc interrupt is sent once to a blocked pane and audited', async () => {
  let sent: [string, string] | null = null
  const { deps, logs } = setup({ send: async (id, key) => { sent = [id, key] } })
  const r = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(r.status, 200)
  assert.deepEqual(r.body, { paneId: 'w:p1', key: 'esc', status: 'sent' })
  assert.deepEqual(sent, ['w:p1', 'esc'])
  assert.deepEqual(logs, [{ paneId: 'w:p1', key: 'esc', result: 'sent' }])
})
