import test from 'node:test'
import assert from 'node:assert/strict'
import { detectUsageWindow } from './usage-window-detect.js'

test('quota duration identifies five-hour, weekly and monthly windows', () => {
  assert.equal(detectUsageWindow(18000), '5h')
  assert.equal(detectUsageWindow(604800), 'w')
  for (const days of [28, 29, 30, 31]) {
    assert.equal(detectUsageWindow(days * 86400), 'm')
  }
})

test('missing, malformed and unsupported durations stay unknown', () => {
  for (const value of [null, undefined, '18000', NaN, Infinity, -1, 0, 1169, 86400]) {
    assert.equal(detectUsageWindow(value), 'unknown')
  }
})
