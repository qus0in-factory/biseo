import test from 'node:test'
import assert from 'node:assert/strict'
import { fresh, future, now, readAvailability } from './test-util/codex-rollout-fixture.js'
import { limitedRate, token } from './test-util/codex-rollout-fixture.js'
import { readAvailability } from './test-util/codex-rollout-fixture.js'
import { elapsedRate, token } from './test-util/codex-rollout-fixture.js'
import { createAvailability } from './codex-availability.js'
import { ttl } from './test-util/codex-rollout-fixture.js'
import { now, readAvailability, session, ttl } from './test-util/codex-rollout-fixture.js'
import { token } from './test-util/codex-rollout-fixture.js'
import { old, readAvailability } from './test-util/codex-rollout-fixture.js'
import { freeRate, token } from './test-util/codex-rollout-fixture.js'

{

test('codex rollout limited snapshot is mapped without raw text', async () => {
  const a = await readAvailability([
    '{"type":"session_meta","payload":{"cwd":"/tmp"}}',
    token(limitedRate()),
  ])
  assert.equal(a.state, 'limited')
  assert.equal(a.window, 'primary')
  assert.equal(a.resetsAt, future)
  assert.equal(a.source, 'codex')
  assert.equal(a.checkedAt, fresh)
  assert.equal(a.observedAt, now.toISOString())
  assert.doesNotMatch(JSON.stringify(a), /SECRET/)
})
}
{

test('expired or malformed snapshots do not block', async () => {
  const a = await readAvailability([token(elapsedRate()), '{broken'])
  assert.equal(a.state, 'unknown')
})

test('a corrupt rollout line yields unknown', async () => {
  const a = await readAvailability(['{broken', '{"type":"event_msg","payload":{"type":"other"}}'])
  assert.equal(a.state, 'unknown')
  assert.equal(a.reason, 'no_snapshot')
})
}
{

test('a rollout without token_count is unknown', async () => {
  const a = await readAvailability(['{"type":"session_meta","payload":{"cwd":"/tmp"}}'])
  assert.equal(a.state, 'unknown')
})
}
{

test('the port carries the ttl so the app layer applies the same rule', () => {
  assert.equal(createAvailability(ttl).ttlMs, ttl)
})
}
{

test('non-codex sessions and missing files are unknown', async () => {
  const plain = await createAvailability(ttl).get({ ...session, source: 'herdr:claude' }, now)
  assert.equal(plain.state, 'unknown')
  assert.equal(plain.source, null)
  const missing = await readAvailability(
    [token({ rate_limit_reached_type: null })],
    { ...session, value: '99999999-2222-4333-8444-555555555555' },
  )
  assert.equal(missing.state, 'unknown')
})
}
{

test('an expired snapshot is unknown and never available', async () => {
  const a = await readAvailability([token(freeRate(), old)])
  assert.equal(a.state, 'unknown')
  assert.notEqual(a.state, 'available')
  assert.equal(a.reason, 'stale_snapshot')
  assert.equal(a.checkedAt, old)
})

test('a snapshot without a reached limit is unknown, never available', async () => {
  const a = await readAvailability([token(freeRate())])
  assert.equal(a.state, 'unknown')
  assert.notEqual(a.state, 'available')
  assert.equal(a.reason, 'no_limit_signal')
})
}
