import test from 'node:test'
import assert from 'node:assert/strict'
import { makeDeps } from '../app/turn-fixture.test.js'
import { reader } from '../app/turn-fixture-data.test.js'
import { appOf } from './route-app-fixture.test.js'
import { availability, type PanesBody } from './panes-availability-fixture.test.js'

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
  assert.equal(b.panes[0].blockedReason, 'usage_limited')
  assert.deepEqual(b.panes[0].availability, availability)
})
