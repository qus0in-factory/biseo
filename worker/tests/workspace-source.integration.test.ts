import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js';

test('server source fails closed instead of falling back to a fixed workspace', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ error: 'bad_gateway' }, { status: 502 })) as any
  try {
    const r = await app.fetch(new Request('http://localhost/api/config', { headers: { Cookie: cookie } }), { ...env, WORKSPACE_CONFIG_SOURCE: 'server' })
    assert.equal(r.status, 502)
    assert.deepEqual(await r.json(), { error: 'workspace_not_configured' })
  } finally { globalThis.fetch = orig }
})

test('server source does not block the public login route', async () => {
  const { env } = await createTimelineTestEnv()
  const r = await app.fetch(
    new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }),
    { ...env, WORKSPACE_CONFIG_SOURCE: 'server' },
  )
  assert.notEqual(r.status, 401)
  assert.notDeepEqual(await r.json(), { error: 'unauthorized' })
})

test('server source resolves the workspace from /herdr/config', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ workspaceId: 'w1V' })) as any
  try {
    const r = await app.fetch(new Request('http://localhost/api/config', { headers: { Cookie: cookie } }), { ...env, WORKSPACE_CONFIG_SOURCE: 'server' })
    assert.equal(r.status, 200)
    assert.deepEqual(await r.json(), { workspaceId: 'w1V' })
  } finally { globalThis.fetch = orig }
})
