import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { post } from './d1-requests.js'
import { body, queued } from './d1-fixtures.js'

test('a second queued request for the same pane is rejected without a prompt', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = (async () => { calls++; return Response.json(queued, { status: 202 }) }) as any
  try {
    await app.fetch(post(body(), cookie), env)
    const busy = await app.fetch(post(body('r2'), cookie), env)
    assert.equal(busy.status, 409)
    assert.deepEqual(await busy.json(), { error: 'target_not_ready', reason: 'agent_busy' })
    assert.equal(calls, 1)
  } finally { globalThis.fetch = orig }
})
