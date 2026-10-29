import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { oneWindow } from './d1-usage-report.js'

const req = (c: string) => new Request('http://localhost/api/usage', { headers: { Cookie: c } })

test('usage keeps the latest D1 snapshot when the collector fails', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  let fail = false
  globalThis.fetch = (async () => fail ? Response.json({ error: 'bad_gateway' }, { status: 502 }) : Response.json(oneWindow)) as any
  try {
    const a: any = await (await app.fetch(req(cookie), env)).json()
    assert.equal(a.stale, false)
    fail = true
    const b: any = await (await app.fetch(req(cookie), env)).json()
    assert.equal(b.stale, true)
    assert.ok(b.lastSuccessAt)
    assert.equal(b.providers[0].windows[0].usedPercent, 7)
  } finally { globalThis.fetch = orig }
})
