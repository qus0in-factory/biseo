import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { insertRow } from './d1-row.js'

test('DELETE conflict leaves the D1 turn queued', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  await insertRow(env.BISEO_DB!, 'r1')
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ error: 'not_cancellable' }, { status: 409 })) as any
  try {
    const res = await app.fetch(new Request('http://localhost/api/turns/r1', {
      method: 'DELETE', headers: { Cookie: cookie, Origin: 'http://localhost' },
    }), env)
    assert.equal(res.status, 409)
    const row = await env.BISEO_DB!.prepare('SELECT status FROM timeline_turns WHERE request_id=?').bind('r1').first()
    assert.equal((row as any).status, 'queued')
  } finally { globalThis.fetch = orig }
})
