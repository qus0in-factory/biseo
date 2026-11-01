import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('GET /api/workspaces requires auth', async () => {
  const { env } = await createTimelineTestEnv()
  const r = await app.fetch(new Request('http://localhost/api/workspaces'), env)
  assert.equal(r.status, 401)
})