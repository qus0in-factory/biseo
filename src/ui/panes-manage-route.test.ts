import test from 'node:test'
import assert from 'node:assert/strict'
import { makeDeps } from '../app/turn-fixture.js'
import { reader } from '../app/turn-data-fixture.js'
import { appOf } from './route-app-fixture.js'
import { auth } from './app-data-fixture.js'

test('pane manage routes require auth', async () => {
  const d = makeDeps(reader)
  const app = appOf(d)
  assert.equal((await app.request('/herdr/panes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({}) })).status, 401)
  assert.equal((await app.request('/herdr/panes/w:p1', { method: 'DELETE' })).status, 401)
  assert.equal((await app.request('/herdr/panes/w:p1/rename', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'x' }) })).status, 401)
})

test('close rejects busy and protected panes', async () => {
  const d = makeDeps(reader)
  d.herdr.getPane = async () => ({ pane_id: 'w:p1', tab_id: 't', workspace_id: 'w', terminal_id: 't', agent_status: 'working', agent: 'claude', label: 'worker', revision: 1 } as any)
  d.herdr.closePane = async () => {}
  const app = appOf(d)
  const r = await app.request('/herdr/panes/w:p1', { method: 'DELETE', headers: auth })
  assert.equal(r.status, 409)
})

test('close rejects coordinator pane', async () => {
  const d = makeDeps(reader)
  d.herdr.getPane = async () => ({ pane_id: 'w:p1', tab_id: 't', workspace_id: 'w', terminal_id: 't', agent_status: 'idle', agent: 'claude', label: 'opus', revision: 1 } as any)
  d.herdr.closePane = async () => {}
  const app = appOf(d)
  const r = await app.request('/herdr/panes/w:p1', { method: 'DELETE', headers: auth })
  assert.equal(r.status, 403)
})

test('close rejects other workspace', async () => {
  const d = makeDeps(reader)
  d.herdr.getPane = async () => ({ pane_id: 'w:p1', tab_id: 't', workspace_id: 'other', terminal_id: 't', agent_status: 'idle', agent: 'claude', label: 'worker', revision: 1 } as any)
  d.herdr.closePane = async () => {}
  const app = appOf(d)
  const r = await app.request('/herdr/panes/w:p1', { method: 'DELETE', headers: auth })
  assert.equal(r.status, 403)
})

test('close rejects inflight and pending', async () => {
  const d = makeDeps(reader)
  d.herdr.getPane = async () => ({ pane_id: 'w:p1', tab_id: 't', workspace_id: 'w', terminal_id: 't', agent_status: 'idle', agent: 'claude', label: 'worker', revision: 1 } as any)
  d.herdr.closePane = async () => {}
  d.locks.reserve('w:p1', 'r1')
  const app = appOf(d)
  let r = await app.request('/herdr/panes/w:p1', { method: 'DELETE', headers: auth })
  assert.equal(r.status, 409)
  d.locks.release('w:p1', 'r1')
  d.queue.add({ requestId: 'q1', paneId: 'w:p1', status: 'queued' } as any)
  r = await app.request('/herdr/panes/w:p1', { method: 'DELETE', headers: auth })
  assert.equal(r.status, 409)
})

test('open validates template and coordinator name', async () => {
  const d = makeDeps(reader)
  d.herdr.createTab = async () => ({ tabId: 't1', paneId: 'w:p2' })
  const app = appOf(d)
  const bad = await app.request('/herdr/panes', { method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body: JSON.stringify({ templateId: 'nope' }) })
  assert.equal(bad.status, 403)
  const coord = await app.request('/herdr/panes', { method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body: JSON.stringify({ name: 'opus' }) })
  assert.equal(coord.status, 403)
})

test('rename validates name and workspace', async () => {
  const d = makeDeps(reader)
  d.herdr.getPane = async () => ({ pane_id: 'w:p1', tab_id: 't', workspace_id: 'w', terminal_id: 't', agent_status: 'idle', agent: 'claude', label: 'worker', revision: 1 } as any)
  d.herdr.renamePane = async () => {}
  d.herdr.renameTab = async () => {}
  d.herdr.renameAgent = async () => {}
  const app = appOf(d)
  const bad = await app.request('/herdr/panes/w:p1/rename', { method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body: JSON.stringify({ name: 'bad name!' }) })
  assert.equal(bad.status, 400)
  const ok = await app.request('/herdr/panes/w:p1/rename', { method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body: JSON.stringify({ name: 'renamed' }) })
  assert.equal(ok.status, 200)
})
