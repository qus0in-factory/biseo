import test from 'node:test'
import assert from 'node:assert/strict'
import { makeDeps } from '../app/turn-fixture.js'
import { pane, reader } from '../app/turn-data-fixture.js'
import { appOf } from './route-app-fixture.js'
import { post } from './interrupt-route-fixture.js'

test('POST /herdr/panes/:paneId/interrupt is authenticated and sends Esc', async () => {
  const d = makeDeps(reader)
  let sent = ''
  d.herdr.getPane = async () => ({ ...pane, agent_status: 'blocked' })
  d.herdr.sendKeys = async (_id, key) => {
    sent = key
  }
  const app = appOf(d)
  const denied = await app.request('/herdr/panes/w:p1/interrupt', post({ key: 'esc' }, ''))
  assert.equal(denied.status, 401)
  const ok = await app.request('/herdr/panes/w:p1/interrupt', post({ key: 'escape' }))
  assert.equal(ok.status, 200)
  assert.equal(sent, 'esc')
  assert.deepEqual(await ok.json(), { paneId: 'w:p1', key: 'esc', status: 'sent' })
})
