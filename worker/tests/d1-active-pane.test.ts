import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { post } from './d1-requests.js'
import { body } from './d1-fixtures.js'
import{queueFetch}from'./queue-fetch-fixture.js'

test('busy pane reservations persist without PM2 enqueue', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = queueFetch(()=>{calls++}) as any
  try {
    const first = await app.fetch(post(body(), cookie), env)
    const second = await app.fetch(post(body('r2'), cookie), env)
    assert.equal(first.status, 202)
    assert.equal(second.status, 202)
    assert.equal(calls, 0)
    assert.equal((await env.BISEO_DB!.prepare('SELECT COUNT(*) AS n FROM timeline_turns').first())?.n,2)
  } finally { globalThis.fetch = orig }
})
