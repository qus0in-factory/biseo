import test from 'node:test'
import assert from 'node:assert/strict'
import { captureTurn } from './capture-turn.js'
import { setup } from './run-fixture.js'
import { item } from './run-data-fixture.js'
test('immediate input request is recorded without changing turn status', async () => {
  const s = setup()
  const d = { ...s.d, input: { classify: async () => true } }
  d.herdr.getAgent = async () => ({ pane_id: item.paneId, terminal_id: 't', agent_status: 'blocked', revision: 1 })
  await captureTurn(d, item, { read: async () => null })
  assert.equal(s.store.get(item.requestId)?.status, 'blocked')
  assert.equal(s.store.get(item.requestId)?.errorCode, 'input_request')
})
