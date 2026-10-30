import assert from 'node:assert/strict'
import test from 'node:test'
import { usageVisibleFromStorage } from './usageVisibility.js'

test('usage visibility defaults to shown and honors stored hide', () => {
  assert.equal(usageVisibleFromStorage(null), true)
  assert.equal(usageVisibleFromStorage('1'), true)
  assert.equal(usageVisibleFromStorage('0'), false)
})
