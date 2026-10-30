import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { post } from './d1-requests.js'
import { body, queued } from './d1-fixtures.js'

test('timeline POST rejects a requestId reused with a different body', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json(queued, { status: 202 })) as any
  try {
    await app.fetch(post(body(), cookie), env)
    const r = await app.fetch(post(body('r1', 'other'), cookie), env)
    assert.equal(r.status, 409)
    assert.deepEqual(await r.json(), { error: 'conflict', reason: 'request_id_payload_mismatch' })
  } finally { globalThis.fetch = orig }
})
