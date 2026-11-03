import assert from 'node:assert/strict'
import test from 'node:test'
import { syncUsage } from '../scheduled-usage.js'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'
import { drive } from '../test-util/upstream-retry-drive.js'
import { writeHistory } from '../infra/d1-usage-history-write.js'
import { readHistory } from '../infra/d1-usage-history-read.js'
import { historyPoint } from '../../shared/tests/support/usage-history-fixture.js'

test('scheduled usage timeout skips upsert and does not retry', async t => {
 const { env } = await createTimelineTestEnv()
 let calls = 0
 let start!: () => void
 const started = new Promise<void>(resolve => { start = resolve })
 t.mock.method(globalThis, 'fetch', () => { calls++; start(); return new Promise(() => {}) })
 t.mock.timers.enable({ apis: ['setTimeout'] })
 try {
  const pending = syncUsage(env.BISEO_DB, env)
  await started
  assert.equal(await drive(t, pending, 10000, 8), false)
  assert.equal(calls, 1)
 } finally { t.mock.timers.reset() }
})

test('failed upstream collection still cleans expired history', async t => {
  const { env } = await createTimelineTestEnv()
  await writeHistory(env.BISEO_DB, [historyPoint(1, 1, 1)], 0)
  t.mock.method(globalThis, 'fetch', async () => new Response('unavailable', { status: 503 }))
  assert.equal(await syncUsage(env.BISEO_DB, env), false)
  assert.equal((await readHistory(env.BISEO_DB, 'codex', 0)).length, 0)
})

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
