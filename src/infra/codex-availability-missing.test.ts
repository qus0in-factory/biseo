import test from 'node:test'
import assert from 'node:assert/strict'
import { readAvailability } from './codex-availability-fixture.test.js'

test('a rollout without token_count is unknown', async () => {
  const a = await readAvailability(['{"type":"session_meta","payload":{"cwd":"/tmp"}}'])
  assert.equal(a.state, 'unknown')
})
