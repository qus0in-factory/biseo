import test from 'node:test'
import assert from 'node:assert/strict'
import { historyConfig } from './usage-history-config.js'

test('history retention and minimum samples are configurable with safe defaults', () => {
  assert.deepEqual(historyConfig({}), { retention: 2592000000, minimum: 2 })
  assert.deepEqual(historyConfig({ USAGE_HISTORY_RETENTION_DAYS: '7',
    USAGE_HISTORY_MIN_SAMPLES: '3' }), { retention: 604800000, minimum: 3 })
  assert.equal(historyConfig({ USAGE_HISTORY_RETENTION_DAYS: '-1',
    USAGE_HISTORY_MIN_SAMPLES: 'NaN' }).minimum, 2)
})
