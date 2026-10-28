import assert from 'node:assert/strict'
import test from 'node:test'
import { issueClaims } from '../domain/issue.js'
import { validateClaims } from '../domain/validate.js'
import { policy } from './fixture.js'

const now = new Date('2026-01-01T00:00:00Z')
const claims = issueClaims(policy, 'service', 'worker', now)

test('bounds lifetime and future issued-at', () => {
  assert.throws(() => validateClaims(policy, 'service', { ...claims, exp: '2036-01-01T00:00:00Z' }, now))
  assert.throws(() => validateClaims(policy, 'service', { ...claims, iat: '2026-01-01T00:00:10Z' }, now))
  assert.doesNotThrow(() => validateClaims(policy, 'service', { ...claims, iat: '2026-01-01T00:00:04Z' }, now))
})
