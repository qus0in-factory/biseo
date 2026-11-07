import test from 'node:test'
import assert from 'node:assert/strict'
import { parseGrokBilling } from './grok-billing-parse.js'

for (const [type, window] of [
  ['USAGE_PERIOD_TYPE_WEEKLY', 'w'], ['USAGE_PERIOD_TYPE_MONTHLY', 'm'],
  [undefined, 'primary'], ['UNRECOGNIZED', 'primary']
]) test(`billing period ${type}`, () => {
  const start = '2026-11-05T00:00:00Z'
  const result = parseGrokBilling({ config: {
    creditUsagePercent: 100, currentPeriod: { type },
    billingPeriodStart: start, billingPeriodEnd: '2026-11-12T00:00:00Z'
  } }, new Date('2026-11-13T00:00:00Z'))
  assert.equal(result.windows[0].window, window)
  assert.equal(result.windows[0].startsAt, start)
  assert.equal(result.metrics[0].startsAt, start)
  assert.equal(result.state, 'available')
})
