import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { post } from './d1-requests.js'
import { body, queued } from './d1-fixtures.js'

test('distinct active turns for a busy pane are both forwarded', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = (async () => { calls++; return Response.json(queued, { status: 202 }) }) as any
  try {
    const first = await app.fetch(post(body(), cookie), env)
    const second = await app.fetch(post(body('r2'), cookie), env)
    assert.equal(first.status, 202)
    assert.equal(second.status, 202)
    assert.equal(calls, 2)
  } finally { globalThis.fetch = orig }
})
