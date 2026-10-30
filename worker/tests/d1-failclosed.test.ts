import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { post } from './d1-requests.js'

test('timeline POST fails closed without BISEO_DB and never calls upstream', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  delete (env as any).BISEO_DB
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = (async () => { calls++; return Response.json({}, { status: 202 }) }) as any
  try {
    const r = await app.fetch(post({ requestId: 'r1', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' }, cookie), env)
    assert.equal(r.status, 500)
    assert.deepEqual(await r.json(), { error: 'storage_unavailable' })
    assert.equal(calls, 0)
  } finally { globalThis.fetch = orig }
})
