import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { post } from './d1-requests.js'

test('a network timeout keeps queued and does not resend the prompt', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = (async () => { calls++; return Response.json({ error: 'timeout' }, { status: 504 }) }) as any
  try {
    const body = { requestId: 'r1', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' }
    assert.equal((await app.fetch(post(body, cookie), env)).status, 202)
    assert.equal((await app.fetch(post(body, cookie), env)).status, 202)
    assert.equal(calls, 1)
    const row = await env.BISEO_DB!.prepare('SELECT status FROM timeline_turns WHERE request_id=?').bind('r1').first()
    assert.equal((row as any).status, 'queued')
  } finally { globalThis.fetch = orig }
})
