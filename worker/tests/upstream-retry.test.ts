import assert from 'node:assert/strict'
import test from 'node:test'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { drive, err, ok, run } from './upstream-retry-helpers.js'

test('GET retries 5xx then succeeds', async (t) => {
  const { env } = await createTimelineTestEnv()
  t.mock.timers.enable({ apis: ['setTimeout'] })
  try {
    const g = await drive(t, run(env, 'GET', (n) => (n < 3 ? err(502) : ok())))
    assert.equal(g.n, 3)
    assert.equal(g.res.ok, true)
  } finally {
    t.mock.timers.reset()
  }
})

test('GET gives up after max 5xx attempts', async (t) => {
  const { env } = await createTimelineTestEnv()
  t.mock.timers.enable({ apis: ['setTimeout'] })
  try {
    const g = await drive(t, run(env, 'GET', () => err(500)))
    assert.equal(g.n, 3)
    assert.deepEqual([g.res.ok, g.res.status], [false, 500])
  } finally {
    t.mock.timers.reset()
  }
})

test('GET retries network error then succeeds', async (t) => {
  const { env } = await createTimelineTestEnv()
  t.mock.timers.enable({ apis: ['setTimeout'] })
  try {
    const g = await drive(t, run(env, 'GET', (n) => {
      if (n === 1) throw new TypeError('fetch failed')
      return ok()
    }))
    assert.equal(g.n, 2)
    assert.equal(g.res.ok, true)
  } finally {
    t.mock.timers.reset()
  }
})
