import test from 'node:test'
import assert from 'node:assert/strict'
import { makeDeps } from '../app/turn-fixture.test.js'
import { reader } from '../app/turn-fixture-data.test.js'
import { appOf } from './route-app-fixture.test.js'
import { post } from './interrupt-route-fixture.test.js'

test('server interrupt rejects non-blocked panes without sending keys', async () => {
  const d = makeDeps(reader)
  let sends = 0
  d.herdr.sendKeys = async () => {
    sends += 1
  }
  const app = appOf(d)
  const r = await app.request('/herdr/panes/w:p1/interrupt', post({ key: 'esc' }))
  assert.equal(r.status, 409)
  assert.deepEqual(await r.json(), { error: 'target_not_ready', reason: 'pane_not_blocked' })
  assert.equal(sends, 0)
})
