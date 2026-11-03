import test from 'node:test'
import assert from 'node:assert/strict'
import { makeDeps } from '../app/test-util/turn-fixture.js'
import { reader } from '../app/test-util/turn-data-fixture.js'
import { appOf } from './test-util/route-app-fixture.js'
import { availability, type PanesBody } from './test-util/panes-availability-fixture.js'
import { Hono } from 'hono'
import { runSse } from './events-sse.js'
import { Wake } from './wake.js'
import { readEvent } from './test-util/events-lock-fixture.js'
import { availability } from './test-util/panes-availability-fixture.js'

{

test('panes route exposes the availability axis and blocks the pane', async () => {
  const d = makeDeps(reader)
  d.availability = { get: async () => availability }
  const app = appOf(d)
  const r = await app.request('/herdr/workspaces/w/panes', {
    headers: { authorization: 'Bearer x' },
  })
  assert.equal(r.status, 200)
  const b = (await r.json()) as PanesBody
  assert.equal(b.panes[0].sendable, false)
  assert.equal(b.panes[0].disabledReason, 'provider_rate_limited')
  assert.equal(b.panes[0].blockedReason, 'usage_limit')
  assert.deepEqual(b.panes[0].availability, availability)
})
}
{

test('SSE pane.updated carries the availability field', async () => {
  const d = makeDeps(reader)
  d.availability = { get: async () => availability }
  const app = new Hono()
  app.get('/e', (c) => runSse(c, d, 'w', () => {}, new Wake()))
  const r = await app.request('/e')
  try {
    const text = await readEvent(r.body!, /"availability"/)
    assert.match(text, /"state":"limited"/)
    assert.match(text, /"disabledReason":"provider_rate_limited"/)
    assert.match(text, /"blockedReason":"usage_limit"/)
  } finally {
    await r.body?.cancel().catch(() => {})
  }
})
}
