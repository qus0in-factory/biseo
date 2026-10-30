import test from 'node:test'
import assert from 'node:assert/strict'
import { parseGrokBilling } from './grok-billing-parse.js'

test('parseGrokBilling valid percent', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const raw = {
    creditUsagePercent: 76.5,
    billingPeriodEnd: '2026-11-05T07:44:56.981+00:00'
  }
  const res = parseGrokBilling(raw, now)
  assert.equal(res.state, 'available')
  assert.equal(res.windows[0].usedPercent, 76.5)
})

test('parseGrokBilling limited', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const raw = {
    creditUsagePercent: 100,
    billingPeriodEnd: '2026-11-05T07:44:56.981+00:00'
  }
  const res = parseGrokBilling(raw, now)
  assert.equal(res.state, 'limited')
})

test('parseGrokBilling missing', () => {
  assert.equal(parseGrokBilling(null).state, 'unknown')
})
