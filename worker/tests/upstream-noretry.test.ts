import assert from 'node:assert/strict'
import test from 'node:test'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { err, run } from './upstream-retry-helpers.js'

test('POST never retries', async () => {
  const { env } = await createTimelineTestEnv()
  const p = await run(env, 'POST', () => err(502))
  assert.equal(p.n, 1)
  assert.deepEqual([p.res.ok, p.res.status], [false, 502])
})

test('GET 4xx is not retried', async () => {
  const { env } = await createTimelineTestEnv()
  const g = await run(env, 'GET', () => err(404))
  assert.equal(g.n, 1)
})
