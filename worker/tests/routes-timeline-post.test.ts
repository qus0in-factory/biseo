import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('POST /api/timeline/messages enforces Origin and forwards 202', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const u = 'http://localhost/api/timeline/messages'
  const body = JSON.stringify({ requestId: 'r1', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' })
  const bad = await app.fetch(
    new Request(u, { method: 'POST', headers: { Cookie: cookie, Origin: 'https://evil.test' }, body }),
    env,
  )
  assert.equal(bad.status, 403)
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ requestId: 'r1', status: 'queued' }, { status: 202 })) as any
  try {
    const ok = await app.fetch(
      new Request(u, { method: 'POST', headers: { Cookie: cookie, Origin: 'http://localhost' }, body }),
      env,
    )
    assert.equal(ok.status, 202)
  } finally {
    globalThis.fetch = orig
  }
})
