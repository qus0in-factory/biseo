import test from 'node:test'
import assert from 'node:assert/strict'
import { createAvailability } from './codex-availability.js'
import { ttl } from './codex-availability-fixture.test.js'

test('the port carries the ttl so the app layer applies the same rule', () => {
  assert.equal(createAvailability(ttl).ttlMs, ttl)
})
