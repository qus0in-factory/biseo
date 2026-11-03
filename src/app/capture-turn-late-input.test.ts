import test from 'node:test'
import assert from 'node:assert/strict'
import { captureTurn } from './capture-turn.js'
import { setup } from './run-fixture.js'
import { item } from './run-data-fixture.js'
test('late blocked input keeps its reason', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })
  try {
    const s = setup(), d = { ...s.d, timeoutMs: 1, lateCaptureMs: 200, input: { classify: async () => true } }
    let blocked = false, reads = 0
    d.herdr.getAgent = async () => ({ pane_id: 'p', terminal_id: 't', revision: 1, agent_status: blocked ? 'blocked' : 'working' })
    await captureTurn(d, item, { read: async () => {
      if (++reads === 1) return null
      blocked = true
      await new Promise(r => setTimeout(r, 2))
      return null
    } })
    t.mock.timers.tick(2)
    await new Promise(r => setImmediate(r))
    assert.equal(s.store.get('r1')?.status, 'blocked')
    assert.equal(s.store.get('r1')?.errorCode, 'input_request')
  } finally { t.mock.timers.reset() }
})
