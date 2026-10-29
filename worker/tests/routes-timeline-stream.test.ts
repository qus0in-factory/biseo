import assert from 'node:assert/strict'
import test from 'node:test'
import { streamOnce } from './stream-helpers.js'

test('GET /api/timeline/stream forwards Last-Event-ID upstream', async () => {
  const { res, id } = await streamOnce('1')
  assert.equal(res.status, 200)
  assert.equal(id, '1')
})

test('GET /api/timeline/stream relays SSE with retry', async () => {
  const { text } = await streamOnce('1')
  assert.match(text, /retry: 3000/)
  assert.match(text, /event: turn\.updated/)
  assert.match(text, /event: heartbeat/)
})
