import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js';
import { getList, getOne } from '../test-util/d1-requests.js';
import { insertRow } from '../test-util/d1-row.js';
import { err, run } from '../test-util/upstream-retry-helpers.js';
import { givesUp, retries5xx } from '../test-util/upstream-retry-5xx-cases.js';
import { retriesNetwork } from '../test-util/upstream-retry-network-case.js';

test('timeline reads stay within owner and workspace scope', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  await insertRow(env.BISEO_DB!, 'other-owner', 'other', 'w1T')
  await insertRow(env.BISEO_DB!, 'other-ws', 'owner', 'otherWs')
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ error: 'not_found' }, { status: 404 })) as any
  try {
    const list: any = await (await app.fetch(getList(cookie), env)).json()
    assert.deepEqual(list.items, [])
    const one = await app.fetch(getOne('other-owner', cookie), env)
    assert.equal(one.status, 404)
  } finally { globalThis.fetch = orig }
})

test('CSRF allows custom domain', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const e = { ...env, ALLOWED_ORIGINS: 'https://biseo.qus0in.workers.dev,https://biseo.qus0in.dev' }
  const b = JSON.stringify({ requestId: 'r1', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' })
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ requestId: 'r1', status: 'queued' }, { status: 202 })) as any
  try {
    const res = await app.fetch(new Request('https://biseo.qus0in.dev/api/timeline/messages', { method: 'POST', headers: { Cookie: cookie, Origin: 'https://biseo.qus0in.dev' }, body: b }), e)
    assert.equal(res.status, 202)
  } finally {
    globalThis.fetch = orig
  }
})

test('CSRF denies unlisted domain', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const e = { ...env, ALLOWED_ORIGINS: 'https://biseo.qus0in.workers.dev,https://biseo.qus0in.dev' }
  const body = JSON.stringify({ requestId: 'r2', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' })
  const res = await app.fetch(
    new Request('https://biseo.qus0in.dev/api/timeline/messages', {
      method: 'POST',
      headers: { Cookie: cookie, Origin: 'https://evil.test' },
      body,
    }),
    e,
  )
  assert.equal(res.status, 403)
})

test('CSRF allows workers.dev', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const e = { ...env, ALLOWED_ORIGINS: 'https://biseo.qus0in.workers.dev,https://biseo.qus0in.dev' }
  const b = JSON.stringify({ requestId: 'r1', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' })
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ requestId: 'r1', status: 'queued' }, { status: 202 })) as any
  try {
    const res = await app.fetch(new Request('https://biseo.qus0in.workers.dev/api/timeline/messages', { method: 'POST', headers: { Cookie: cookie, Origin: 'https://biseo.qus0in.workers.dev' }, body: b }), e)
    assert.equal(res.status, 202)
  } finally {
    globalThis.fetch = orig
  }
})

test('POST never retries', async () => {
  const { env } = await createTimelineTestEnv()
  const p = await run(env, 'POST', () => err(502))
  assert.equal(p.n, 1)
  assert.deepEqual([p.res.ok, p.res.status], [false, 502])
})

test('GET 4xx is not retried', async () => {
  const { env } = await createTimelineTestEnv()
  const g = await run(env, 'GET', () => err(404))
  assert.equal(g.n, 1)
})

test('GET retries 5xx then succeeds',retries5xx)
test('GET gives up after max 5xx attempts',givesUp)
test('GET retries network error then succeeds',retriesNetwork)
