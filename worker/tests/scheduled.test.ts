import assert from 'node:assert/strict'
import test from 'node:test'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'
import { workingRow } from '../test-util/queue-working-fixture.js'
import { cronFetch } from '../test-util/d1-cron-fetch.js'
import { insertRow } from '../test-util/d1-row.js'
import { recoveryFetch as rf } from '../test-util/d1-recovery-fetch.js'
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

test('timeout is terminal even when executor record is missing', async () => {
  const { env } = await createTimelineTestEnv()
  await insertRow(env.BISEO_DB!, 'r1', 'owner', 'w1T', 'timeout')
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = rf(() => { calls++ }) as any
  try {
    await scheduled({} as any, env as any, {} as any)
    const r: any = await env.BISEO_DB!.prepare('SELECT * FROM timeline_turns WHERE request_id=?').bind('r1').first()
    assert.equal(r.status, 'failed')
    assert.equal(r.error_code, 'delivery_uncertain')
    assert.equal(r.next_check_at,null)
    await scheduled({} as any, env as any, {} as any)
    assert.equal(calls, 0)
  } finally { globalThis.fetch = orig }
})
