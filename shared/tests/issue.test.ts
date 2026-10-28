import assert from 'node:assert/strict'
import test from 'node:test'
import { issueClaims } from '../domain/issue.js'
import { policy } from './fixture.js'

test('separates audiences and purposes', () => {
  const now = new Date('2026-01-01T00:00:00Z')
  const user = issueClaims(policy, 'user-session', 'u1', now)
  const service = issueClaims(policy, 'service', 'svc', now)
  assert.equal(user.aud, 'biseo-user')
  assert.equal(service.aud, 'biseo-service')
  assert.equal(user.purpose, 'user-session')
  assert.equal(service.purpose, 'service')
  assert.ok(Date.parse(user.exp) > now.getTime())
})
