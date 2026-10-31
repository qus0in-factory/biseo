import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('POST /api/workspaces/select requires auth', async () => {
  const { env } = await createTimelineTestEnv()
  const r = await app.fetch(new Request('http://localhost/api/workspaces/select', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workspaceId: 'w1T' }) }), env)
  assert.equal(r.status, 401)
})