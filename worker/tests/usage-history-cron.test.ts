import test from 'node:test'
import assert from 'node:assert/strict'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'
import { syncUsage } from '../scheduled-usage.js'
import { readHistory } from '../infra/d1-usage-history-read.js'

test('Cron persists paired history beside the replaceable latest snapshot', async t => {
  const { env } = await createTimelineTestEnv()
  const metrics = ['primary', 'secondary'].map(id => ({
    id, unit: 'percent', used: 10, resetsAt: '2030-01-01T00:00:00Z',
  }))
  t.mock.method(globalThis, 'fetch', async () => Response.json({ providers: [
    { provider: 'codex', state: 'available', metrics },
  ] }))
  assert.equal(await syncUsage(env.BISEO_DB, env), true)
  const points = await readHistory(env.BISEO_DB, 'codex', 0)
  assert.equal(points.length, 1)
  assert.equal(points[0].five, 10)
})
