import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from './app.js'
import { makeDeps } from '../app/turn-fixture.test.js'
import { pane, reader } from '../app/turn-fixture-data.test.js'

const appOf = (d: ReturnType<typeof makeDeps>) =>
  createApp({
    ...d,
    verify: async (t) => {
      if (t !== 'x') throw new Error('no')
    },
    healthStatus: 'ok',
    timeoutMs: 1000,
    graceMs: 0,
  })
const post = (body: unknown, auth = 'Bearer x') => ({
  method: 'POST',
  headers: { authorization: auth, 'content-type': 'application/json' },
  body: JSON.stringify(body),
})

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

test('server interrupt rejects unknown keys and relays usage limits as 409', async () => {
  const d = makeDeps(reader)
  d.interruptAllowlist = { default: ['esc'], opencode: ['esc'] }
  d.herdr.sendKeys = async () => {}
  const reset = new Date(Date.now() + 60000).toISOString()
  d.availability = {
    get: async () => ({
      state: 'limited',
      source: 'codex',
      checkedAt: new Date().toISOString(),
      resetsAt: reset,
      reason: 'rate_limit_reached',
      window: 'primary',
    }),
  }
  const app = appOf(d)
  const bad = await app.request('/herdr/panes/w:p1/interrupt', post({ key: 'enter' }))
  assert.equal(bad.status, 400)
  const limited = await app.request('/herdr/panes/w:p1/interrupt', post({ key: 'esc' }))
  assert.equal(limited.status, 409)
  assert.deepEqual(await limited.json(), {
    error: 'target_not_ready',
    reason: 'usage_limited',
    resetsAt: reset,
  })
})
