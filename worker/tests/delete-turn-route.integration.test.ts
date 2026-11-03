import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js';
import { insertRow } from '../test-util/d1-row.js';
import { delTurn } from '../test-util/d1-requests.js';

test('DELETE conflict leaves the D1 turn working', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  await insertRow(env.BISEO_DB!, 'r1','owner','w1T','working')
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ error: 'not_cancellable' }, { status: 409 })) as any
  try {
    const res = await app.fetch(new Request('http://localhost/api/turns/r1', {
      method: 'DELETE', headers: { Cookie: cookie, Origin: 'http://localhost' },
    }), env)
    assert.equal(res.status, 409)
    const row = await env.BISEO_DB!.prepare('SELECT status FROM timeline_turns WHERE request_id=?').bind('r1').first()
    assert.equal((row as any).status, 'working')
  } finally { globalThis.fetch = orig }
})

test('DELETE persists cancellation and keeps remaining turns FIFO', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const db = env.BISEO_DB!
  for (const id of ['r1', 'r2', 'r3']) await insertRow(db, id)
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ requestId: 'r2', status: 'cancelled' })) as any
  try {
    const res = await app.fetch(delTurn('r2', cookie), env)
    assert.equal(res.status, 200)
    const rows = await db.prepare('SELECT request_id,status FROM timeline_turns ORDER BY seq').all()
    assert.deepEqual((rows.results as any[]).map((r) => [r.request_id, r.status]), [['r1', 'queued'], ['r2', 'cancelled'], ['r3', 'queued']])
  } finally { globalThis.fetch = orig }
})

test('DELETE /api/turns/:id checks Origin and forwards', async () => {
  const {env,cookie}=await createTimelineTestEnv()
  await insertRow(env.BISEO_DB, 'r1', 'owner', 'w1T', 'working')
  const u = 'http://localhost/api/turns/r1'
  const bad = await app.fetch(new Request(u, { method: 'DELETE', headers: { Cookie: cookie, Origin: 'https://evil.test' } }), env)
  assert.equal(bad.status, 403)
  const orig = globalThis.fetch
  let req=new Request(u)
  globalThis.fetch = (async(input:any,init:any) => {
    req=new Request(input,init)
    return Response.json({ requestId: 'r1', status: 'cancelled' })
  })as any
  try {
    const ok = await app.fetch(new Request(u, { method: 'DELETE', headers: { Cookie: cookie, Origin: 'http://localhost' } }), env)
    assert.equal(ok.status, 200)
    assert.equal(req.method, 'DELETE')
    assert.ok(req.url.endsWith('/herdr/turns/r1'))
  } finally {
    globalThis.fetch = orig
  }
})
