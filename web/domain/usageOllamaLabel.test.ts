import test from 'node:test'
import assert from 'node:assert/strict'
import { usageMetricName } from './usage-metric-name.js'
import r from '../resources.json'

const res = r as Record<string, string>

test('ollama balance labels come from resources', () => {
  assert.equal(usageMetricName('ollama', 'included_balance', 'fallback', res), 'Included Balance')
  assert.equal(usageMetricName('ollama', 'purchased_balance', 'fallback', res), 'Purchased Balance')
})
