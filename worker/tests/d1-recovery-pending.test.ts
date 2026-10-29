import assert from 'node:assert/strict'
import test from 'node:test'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { insertRow } from './d1-row.js'
import { recoveryFetch as rf } from './d1-recovery-fetch.js'
import { scheduled } from '../scheduled.js'

test('404 keeps timeout pending', async () => {
  const { env } = await createTimelineTestEnv()
  await insertRow(env.BISEO_DB!, 'r1', 'owner', 'w1T', 'timeout')
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = rf(() => { calls++ }) as any
  try {
    await scheduled({} as any, env as any, {} as any)
    const r: any = await env.BISEO_DB!.prepare('SELECT status,error_code,next_check_at FROM timeline_turns WHERE request_id=?').bind('r1').first()
    assert.equal(r.status, 'timeout')
    assert.equal(r.error_code, 'recovery_pending')
    assert.ok(Date.parse(r.next_check_at) > Date.now())
    await scheduled({} as any, env as any, {} as any)
    assert.equal(calls, 1)
  } finally { globalThis.fetch = orig }
})
