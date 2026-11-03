import assert from 'node:assert/strict'
import test from 'node:test'
import { isAuthRequired } from './usage-auth-state.js'
import { isResetPassed } from './usage-auth-state.js'
import { getReauthPrompt } from './usage-auth-state.js'
import r from '../resources.json'

const res = r as Record<string, string>

test('usage auth state detects auth failure, passed resets and localized prompts', () => {
  const p1 = { provider: 'grok', state: 'available' as const, windows: [], reason: 'auth_required' }
  const p2 = { provider: 'claude', state: 'available' as const, windows: [], reason: null }
  assert.equal(isAuthRequired(p1), true)
  assert.equal(isAuthRequired(p2), false)

  const now = Date.parse('2026-11-02T12:00:00Z')
  assert.equal(isResetPassed('2026-11-02T11:00:00Z', now), true)
  assert.equal(isResetPassed('2026-11-02T13:00:00Z', now), false)
  assert.equal(isResetPassed(null, now), false)

  const prompt = getReauthPrompt('grok', res)
  assert.ok(prompt.includes('Grok'))
  assert.equal(prompt.includes('token'), false)
  assert.equal(prompt.includes('access'), false)
})
