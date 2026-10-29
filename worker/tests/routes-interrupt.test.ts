import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

const req = (paneId: string, body: unknown, headers: Record<string, string>) =>
  new Request(`http://localhost/api/panes/${paneId}/interrupt`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })

test('POST /api/panes/:paneId/interrupt enforces Origin and workspace prefix', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const badOrigin = await app.fetch(
    req('w1T:p1', { key: 'esc' }, { Cookie: cookie, Origin: 'https://evil.test' }),
    env,
  )
  assert.equal(badOrigin.status, 403)
  assert.deepEqual(await badOrigin.json(), { error: 'forbidden', reason: 'origin_not_allowed' })

  const other = await app.fetch(
    req('w2:p1', { key: 'esc' }, { Cookie: cookie, Origin: 'http://localhost' }),
    env,
  )
  assert.equal(other.status, 403)
  assert.deepEqual(await other.json(), { error: 'forbidden', reason: 'workspace_not_allowed' })

  const badKey = await app.fetch(
    req('w1T:p1', { key: 'return!' }, { Cookie: cookie, Origin: 'http://localhost' }),
    env,
  )
  assert.equal(badKey.status, 400)

  const noAuth = await app.fetch(
    req('w1T:p1', { key: 'esc' }, { Origin: 'http://localhost' }),
    env,
  )
  assert.equal(noAuth.status, 401)
})

test('worker relays Esc and upstream usage-limit conflicts', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const headers = { Cookie: cookie, Origin: 'http://localhost' }
  const orig = globalThis.fetch
  try {
    let seen: Request | null = null
    globalThis.fetch = (async (input: any, init: any) => {
      seen = new Request(input, init)
      return Response.json({ paneId: 'w1T:p1', key: 'esc', status: 'sent' })
    }) as any
    const ok = await app.fetch(req('w1T:p1', { key: 'escape' }, headers), env)
    assert.equal(ok.status, 200)
    assert.equal(seen!.method, 'POST')
    assert.equal(new URL(seen!.url).pathname, '/herdr/panes/w1T%3Ap1/interrupt')
    assert.deepEqual(await seen!.json(), { key: 'escape' })

    globalThis.fetch = (async () =>
      Response.json(
        { error: 'target_not_ready', reason: 'usage_limited', resetsAt: '2026-10-29T11:00:00.000Z' },
        { status: 409 },
      )) as any
    const limited = await app.fetch(req('w1T:p1', { key: 'esc' }, headers), env)
    assert.equal(limited.status, 409)
    assert.deepEqual(await limited.json(), {
      error: 'target_not_ready',
      reason: 'usage_limited',
      resetsAt: '2026-10-29T11:00:00.000Z',
    })
  } finally {
    globalThis.fetch = orig
  }
})
