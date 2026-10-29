import assert from 'node:assert/strict'
import test from 'node:test'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { err, ok, run } from './upstream-retry-helpers.js'

test('GET retries 5xx then succeeds', async () => {
  const { env } = await createTimelineTestEnv()
  const g = await run(env, 'GET', (n) => (n < 3 ? err(502) : ok()))
  assert.equal(g.n, 3)
  assert.equal(g.res.ok, true)
})

test('GET gives up after max 5xx attempts', async () => {
  const { env } = await createTimelineTestEnv()
  const g = await run(env, 'GET', () => err(500))
  assert.equal(g.n, 3)
  assert.deepEqual([g.res.ok, g.res.status], [false, 500])
})

test('GET retries network error then succeeds', async () => {
  const { env } = await createTimelineTestEnv()
  const g = await run(env, 'GET', (n) => {
    if (n === 1) throw new TypeError('fetch failed')
    return ok()
  })
  assert.equal(g.n, 2)
  assert.equal(g.res.ok, true)
})
