import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('DELETE /api/turns/:id checks Origin and forwards', async () => {
  const {env,cookie}=await createTimelineTestEnv()
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
