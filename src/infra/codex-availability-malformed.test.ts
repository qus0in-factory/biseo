import test from 'node:test'
import assert from 'node:assert/strict'
import { readAvailability } from './codex-availability-fixture.test.js'
import { elapsedRate, token } from './codex-rate-fixture.test.js'

test('expired or malformed snapshots do not block', async () => {
  const a = await readAvailability([token(elapsedRate()), '{broken'])
  assert.equal(a.state, 'unknown')
})

test('a corrupt rollout line yields unknown', async () => {
  const a = await readAvailability(['{broken', '{"type":"event_msg","payload":{"type":"other"}}'])
  assert.equal(a.state, 'unknown')
  assert.equal(a.reason, 'no_snapshot')
})
