import test from 'node:test'
import assert from 'node:assert/strict'
import { createAvailability } from './codex-availability.js'
import { now, readAvailability, session, ttl } from './codex-availability-fixture.test.js'
import { token } from './codex-rate-fixture.test.js'

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
