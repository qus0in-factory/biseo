import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { syncUsage } from '../scheduled-usage.js'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'
import { drive } from '../test-util/upstream-retry-drive.js'

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

test('Cron keeps only the latest snapshot and no usage_history table or route remains', async t => {
  const { env, cookie } = await createTimelineTestEnv()
  const metrics = [{ id: 'primary', unit: 'percent', used: 10, resetsAt: '2030-01-01T00:00:00Z' }]
  t.mock.method(globalThis, 'fetch', async () => Response.json({ providers: [
    { provider: 'codex', state: 'available', metrics },
  ] }))
  assert.equal(await syncUsage(env.BISEO_DB, env), true)
  const tables = await env.BISEO_DB.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'usage_history'").all()
  assert.equal(tables.results.length, 0)
  const response = await app.fetch(new Request('http://localhost/api/usage/history/codex', {
    headers: { Cookie: cookie },
  }), env)
  assert.equal(response.status, 404)
})
