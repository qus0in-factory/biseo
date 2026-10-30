import assert from 'node:assert/strict'
import test from 'node:test'
import { usagePercentText, usageWindowName } from './usage.js'

test('usage shows actual percent and keeps unknown as unknown', () => {
  assert.equal(usagePercentText(42, 'unknown'), '42%')
  assert.equal(usagePercentText(0, 'unknown'), '0%')
  assert.equal(usagePercentText(null, 'unknown'), 'unknown')
  assert.notEqual(usagePercentText(null, 'unknown'), '0%')
})

test('usage preserves primary/secondary labels', () => {
  assert.equal(usageWindowName('primary', { usageWindow_primary: '기본' }), '기본')
  assert.equal(usageWindowName('secondary', {}), 'secondary')
})
