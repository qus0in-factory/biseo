import test from 'node:test'
import assert from 'node:assert/strict'
import { Hono } from 'hono'
import { createApp } from './app.js'
import { runSse } from './events-sse.js'
import { Wake } from './wake.js'
import { readEvent } from './events-lock-fixture.js'
import { makeDeps } from '../app/turn-fixture.test.js'
import { reader } from '../app/turn-fixture-data.test.js'

const availability = {
  state: 'limited' as const,
  source: 'codex',
  checkedAt: '2026-10-29T10:00:00.000Z',
  resetsAt: new Date(Date.now() + 60000).toISOString(),
  reason: 'rate_limit_reached',
  window: 'primary' as const,
}

test('panes route exposes the availability axis and blocks the pane', async () => {
  const d = makeDeps(reader)
  d.availability = { get: async () => availability }
  const app = createApp({
    ...d,
    verify: async () => {},
    healthStatus: 'ok',
    timeoutMs: 1000,
    graceMs: 0,
  })
  const r = await app.request('/herdr/workspaces/w/panes', {
    headers: { authorization: 'Bearer x' },
  })
  assert.equal(r.status, 200)
  const b = (await r.json()) as {
    panes: { sendable: boolean; disabledReason: string; availability: unknown }[]
  }
  assert.equal(b.panes[0].sendable, false)
  assert.equal(b.panes[0].disabledReason, 'provider_rate_limited')
  assert.deepEqual(b.panes[0].availability, availability)
})

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
  } finally {
    await r.body?.cancel().catch(() => {})
  }
})
