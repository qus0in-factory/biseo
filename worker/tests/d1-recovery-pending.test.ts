import assert from 'node:assert/strict'
import test from 'node:test'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { insertRow } from './d1-row.js'
import { recoveryFetch as rf } from './d1-recovery-fetch.js'
import { scheduled } from '../scheduled.js'

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
