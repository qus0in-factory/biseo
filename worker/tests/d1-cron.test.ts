import assert from 'node:assert/strict'
import test from 'node:test'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { workingRow } from './queue-working-fixture.js'
import { cronFetch } from './d1-cron-fetch.js'
import { scheduled } from '../scheduled.js'

test('cron reconciles a completed result without a browser', async () => {
  const { env } = await createTimelineTestEnv()
  await workingRow(env.BISEO_DB!)
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = cronFetch(() => { calls++ }) as any
  try {
    await scheduled({} as any, env as any, {} as any)
    const row = await env.BISEO_DB!.prepare('SELECT status FROM timeline_turns WHERE request_id=?').bind('r1').first()
    assert.equal((row as any).status, 'completed')
    assert.equal(calls, 1)
  } finally { globalThis.fetch = orig }
})
