import test from 'node:test'
import assert from 'node:assert/strict'
import { runTurn } from './run-turn.js'
import { setup } from './run-fixture.js'
import { item } from './run-data-fixture.js'
import { pane, agent } from './turn-data-fixture.js'
test('blocked recheck records input reason without sending a prompt', async () => {
  const s = setup(), d = { ...s.d, input: { classify: async () => true } }
  d.herdr.getAgent = async () => ({ ...agent, agent_status: 'blocked' })
  await runTurn(d, item, { read: async () => null }, { pane, agent })
  assert.equal(s.calls.prompt, 0)
  assert.equal(s.store.get('r1')?.status, 'blocked')
  assert.equal(s.store.get('r1')?.errorCode, 'input_request')
})
