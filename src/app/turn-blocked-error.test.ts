import test from 'node:test'
import assert from 'node:assert/strict'
import { turnBlockedError } from './turn-blocked-error.js'
test('input evidence separates turns, limits and errors remain blocked', async () => {
  const yes = { classify: async () => true }
  assert.equal(await turnBlockedError({ input: yes }, 'p'), 'input_request')
  assert.equal(await turnBlockedError({ input: yes, limit: yes }, 'p'), 'agent_blocked')
  assert.equal(await turnBlockedError({}, 'p'), 'agent_blocked')
  const bad = { classify: async () => { throw Error('offline') } }
  assert.equal(await turnBlockedError({ input: bad }, 'p'), 'agent_blocked')
})
