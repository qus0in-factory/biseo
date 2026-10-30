import test from 'node:test'
import assert from 'node:assert/strict'
import { Hono } from 'hono'
import { runSse } from './events-sse.js'
import { Wake } from './wake.js'
import { readEvent } from './events-lock-fixture.js'
import { makeDeps } from '../app/turn-fixture.js'
import { reader } from '../app/turn-data-fixture.js'
import { availability } from './panes-availability-fixture.js'

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
