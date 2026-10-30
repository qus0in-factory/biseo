import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { post } from './d1-requests.js'
import { body, queued } from './d1-fixtures.js'

test('timeline POST stores queued once and returns the existing row for the same payload', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = (async () => { calls++; return Response.json(queued, { status: 202 }) }) as any
  try {
    assert.equal((await app.fetch(post(body(), cookie), env)).status, 202)
    assert.equal((await app.fetch(post(body(), cookie), env)).status, 202)
    assert.equal(calls, 1)
    const row = await env.BISEO_DB!.prepare('SELECT status FROM timeline_turns WHERE request_id=?').bind('r1').first()
    assert.equal((row as any).status, 'queued')
  } finally { globalThis.fetch = orig }
})
