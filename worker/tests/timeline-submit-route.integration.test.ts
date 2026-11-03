import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js';
import { post } from '../test-util/d1-requests.js';
import { body, queued } from '../test-util/d1-fixtures.js';
import { queueFetch } from '../test-util/queue-fetch-fixture.js';

test('busy pane reservations persist without PM2 enqueue', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = queueFetch(()=>{calls++}) as any
  try {
    const first = await app.fetch(post(body(), cookie), env)
    const second = await app.fetch(post(body('r2'), cookie), env)
    assert.equal(first.status, 202)
    assert.equal(second.status, 202)
    assert.equal(calls, 0)
    assert.equal((await env.BISEO_DB!.prepare('SELECT COUNT(*) AS n FROM timeline_turns').first())?.n,2)
  } finally { globalThis.fetch = orig }
})

test('timeline POST fails closed without BISEO_DB and never calls upstream', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  delete (env as any).BISEO_DB
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = (async () => { calls++; return Response.json({}, { status: 202 }) }) as any
  try {
    const r = await app.fetch(post({ requestId: 'r1', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' }, cookie), env)
    assert.equal(r.status, 500)
    assert.deepEqual(await r.json(), { error: 'storage_unavailable' })
    assert.equal(calls, 0)
  } finally { globalThis.fetch = orig }
})

test('timeline POST stores queued once and returns the existing row for the same payload', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = queueFetch(()=>{calls++}) as any
  try {
    assert.equal((await app.fetch(post(body(), cookie), env)).status, 202)
    assert.equal((await app.fetch(post(body(), cookie), env)).status, 202)
    assert.equal(calls, 0)
    const row = await env.BISEO_DB!.prepare('SELECT status FROM timeline_turns WHERE request_id=?').bind('r1').first()
    assert.equal((row as any).status, 'queued')
  } finally { globalThis.fetch = orig }
})

test('timeline POST rejects a requestId reused with a different body', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json(queued, { status: 202 })) as any
  try {
    await app.fetch(post(body(), cookie), env)
    const r = await app.fetch(post(body('r1', 'other'), cookie), env)
    assert.equal(r.status, 409)
    assert.deepEqual(await r.json(), { error: 'conflict', reason: 'request_id_payload_mismatch' })
  } finally { globalThis.fetch = orig }
})

test('execute response loss fails uncertain without resend', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  let calls = 0
  const orig = globalThis.fetch
  globalThis.fetch = queueFetch(()=>{calls++},true,504) as any
  try {
    const body = { requestId: 'r1', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' }
    assert.equal((await app.fetch(post(body, cookie), env)).status, 202)
    assert.equal((await app.fetch(post(body, cookie), env)).status, 202)
    assert.equal(calls, 1)
    const row = await env.BISEO_DB!.prepare('SELECT status FROM timeline_turns WHERE request_id=?').bind('r1').first()
    assert.equal((row as any).status, 'failed')
  } finally { globalThis.fetch = orig }
})

test('POST /api/timeline/messages enforces Origin and forwards 202', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const u = 'http://localhost/api/timeline/messages'
  const body = JSON.stringify({ requestId: 'r1', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' })
  const bad = await app.fetch(
    new Request(u, { method: 'POST', headers: { Cookie: cookie, Origin: 'https://evil.test' }, body }),
    env,
  )
  assert.equal(bad.status, 403)
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ requestId: 'r1', status: 'queued' }, { status: 202 })) as any
  try {
    const ok = await app.fetch(
      new Request(u, { method: 'POST', headers: { Cookie: cookie, Origin: 'http://localhost' }, body }),
      env,
    )
    assert.equal(ok.status, 202)
  } finally {
    globalThis.fetch = orig
  }
})
