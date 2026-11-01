import assert from 'node:assert/strict'
import test from 'node:test'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { insertRow } from './d1-row.js'
import { cronFetch } from './d1-cron-fetch.js'
import { scheduled } from '../scheduled.js'

test('timeout terminates uncertain rather than accepting a late result', async () => {
  const { env } = await createTimelineTestEnv()
  await insertRow(env.BISEO_DB!, 'r1', 'owner', 'w1T', 'timeout')
  const orig = globalThis.fetch
  globalThis.fetch = cronFetch(() => {}) as any
  try {
    await scheduled({} as any, env as any, {} as any)
    const row: any = await env.BISEO_DB!.prepare('SELECT status,response_text FROM timeline_turns WHERE request_id=?').bind('r1').first()
    assert.equal(row.status, 'failed')
    assert.equal(row.response_text, null)
  } finally { globalThis.fetch = orig }
})
