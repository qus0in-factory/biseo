import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('history API rejects unauthenticated requests', async () => {
  const { env } = await createTimelineTestEnv()
  const response = await app.fetch(new Request('http://localhost/api/usage/history/codex'), env)
  assert.equal(response.status, 401)
})
