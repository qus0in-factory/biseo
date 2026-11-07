import test from 'node:test'
import assert from 'node:assert/strict'
import { grokBillingPeriod } from './grok-billing-period.js'

test('inherited keys are not billing windows', () => {
  for (const type of ['constructor', '__proto__', 'toString']) {
    assert.equal(grokBillingPeriod({ currentPeriod: { type } }).window, 'primary')
  }
})
