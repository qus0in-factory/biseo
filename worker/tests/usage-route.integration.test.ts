import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js';
import { oneWindow, usageReport } from '../test-util/d1-usage-report.js';

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

const empty = { providers: [{ provider: 'codex', state: 'unknown', windows: [] }] }

test('an empty window report clears the old percent', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  let body: unknown = oneWindow
  globalThis.fetch = (async () => Response.json(body)) as any
  try {
    const first: any = await (await app.fetch(req(cookie), env)).json()
    assert.equal(first.providers[0].windows[0].usedPercent, 7)
    body = empty
    const second: any = await (await app.fetch(req(cookie), env)).json()
    assert.equal(second.stale, false)
    assert.equal(second.providers[0].windows[0].usedPercent, null)
  } finally { globalThis.fetch = orig }
})


test('usage stores actual window usedPercent and unknown values as null', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json(usageReport)) as any
  try {
    const first: any = await (await app.fetch(req(cookie), env)).json()
    const codex = first.providers.find((p: any) => p.provider === 'codex')
    const claude = first.providers.find((p: any) => p.provider === 'claude')
    assert.equal(codex.windows[0].usedPercent, 42)
    assert.equal(codex.windows[1].usedPercent, null)
    assert.equal(claude.windows[0].usedPercent, null)
  } finally { globalThis.fetch = orig }
})

test('usage timeout returns stale 200 after one upstream attempt', async t => {
 const { env, cookie } = await createTimelineTestEnv()
 let calls = 0
 let start!: () => void
 const started = new Promise<void>(resolve => { start = resolve })
 t.mock.method(globalThis, 'fetch', () => {
  calls++
  start()
  return new Promise(() => {})
 })
 t.mock.timers.enable({ apis: ['setTimeout'] })
 try {
  const responsePromise = Promise.resolve(app.fetch(new Request('https://local/api/usage', {
   headers: { Cookie: cookie },
  }), env))
  // Wait for authentication/signing before advancing ky's clock.
  await started
  t.mock.timers.tick(30000)
  const response = await responsePromise
  assert.equal(response.status, 200)
  assert.equal((await response.json() as { stale: boolean }).stale, true)
  assert.equal(calls, 1)
 } finally { t.mock.timers.reset() }
})
