import assert from 'node:assert/strict'
import test from 'node:test'
import { issueClaims } from '../domain/issue.js'
import { validateClaims } from '../domain/validate.js'
import { policy } from './fixture.js'

const now = new Date('2026-01-01T00:00:00Z')
const user = issueClaims(policy, 'user-session', 'u1', now)

test('accepts matching claims', () => {
  assert.equal(validateClaims(policy, 'user-session', user, now), user)
})

test('rejects wrong issuer, purpose, audience, expiry, subject', () => {
  assert.throws(() => validateClaims(policy, 'user-session', { ...user, iss: 'x' }, now))
  assert.throws(() => validateClaims(policy, 'service', user, now))
  assert.throws(() => validateClaims(policy, 'user-session', { ...user, aud: 'x' }, now))
  assert.throws(() => validateClaims(policy, 'user-session', { ...user, exp: '2025-01-01T00:00:00Z' }, now))
  assert.throws(() => validateClaims(policy, 'user-session', { ...user, sub: '' }, now))
})
