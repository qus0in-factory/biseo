import test from 'node:test'
import assert from 'node:assert/strict'
import { makeDeps } from '../app/turn-fixture.test.js'
import { reader } from '../app/turn-fixture-data.test.js'
import { appOf } from './route-app-fixture.test.js'
import { limitedAvailability, limitedBody, post } from './interrupt-route-fixture.test.js'

test('server interrupt rejects unknown keys and relays usage limits as 409', async () => {
  const d = makeDeps(reader)
  d.interruptAllowlist = { default: ['esc'], opencode: ['esc'] }
  d.herdr.sendKeys = async () => {}
  const reset = new Date(Date.now() + 60000).toISOString()
  d.availability = { get: async () => limitedAvailability(reset) }
  const app = appOf(d)
  const bad = await app.request('/herdr/panes/w:p1/interrupt', post({ key: 'enter' }))
  assert.equal(bad.status, 400)
  const limited = await app.request('/herdr/panes/w:p1/interrupt', post({ key: 'esc' }))
  assert.equal(limited.status, 409)
  assert.deepEqual(await limited.json(), limitedBody(reset))
})
