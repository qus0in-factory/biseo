import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('GET /api/workspaces requires auth', async () => {
  const { env } = await createTimelineTestEnv()
  const r = await app.fetch(new Request('http://localhost/api/workspaces'), env)
  assert.equal(r.status, 401)
})

test('POST /api/workspaces/select requires auth', async () => {
  const { env } = await createTimelineTestEnv()
  const r = await app.fetch(new Request('http://localhost/api/workspaces/select', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workspaceId: 'w1T' }) }), env)
  assert.equal(r.status, 401)
})

test('POST /api/workspaces/select proxies rejection for unknown id', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ error: 'workspace_not_allowed' }, { status: 403 })) as any
  try {
    const r = await app.fetch(new Request('http://localhost/api/workspaces/select', { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ workspaceId: 'unknown' }) }), env)
    assert.equal(r.status, 403)
    assert.deepEqual(await r.json(), { error: 'workspace_not_allowed' })
  } finally { globalThis.fetch = orig }
})

test('POST /api/workspaces/select proxies successful selection', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ workspaceId: 'w1V', ok: true })) as any
  try {
    const r = await app.fetch(new Request('http://localhost/api/workspaces/select', { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ workspaceId: 'w1V' }) }), env)
    assert.equal(r.status, 200)
    assert.deepEqual(await r.json(), { workspaceId: 'w1V', ok: true })
  } finally { globalThis.fetch = orig }
})

test('GET /api/workspaces lists detected workspaces', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ workspaces: [{ workspaceId: 'w1T', id: 'w1T', label: 'main', focused: true, paneCount: 1 }] })) as any
  try {
    const r = await app.fetch(new Request('http://localhost/api/workspaces', { headers: { Cookie: cookie } }), env)
    assert.equal(r.status, 200)
    assert.deepEqual(await r.json(), { workspaces: [{ workspaceId: 'w1T', id: 'w1T', label: 'main', focused: true, paneCount: 1 }] })
  } finally { globalThis.fetch = orig }
})
