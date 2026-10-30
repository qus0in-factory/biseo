import test from 'node:test'
import assert from 'node:assert/strict'
import { isFreeLockSignal } from './opencode-free-markers.js'

test('lock markers come from env, not hardcoded literals', () => {
  assert.equal(isFreeLockSignal('FreeUsageLimitError', 400), true)
  assert.equal(isFreeLockSignal(null, 429), true)
  assert.equal(isFreeLockSignal('other', 200), false)
  process.env.BISEO_OPENCODE_FREE_LOCK_ERRORS = 'CustomLimit'
  try {
    assert.equal(isFreeLockSignal('CustomLimit', 200), true)
    assert.equal(isFreeLockSignal('FreeUsageLimitError', 200), false)
  } finally {
    delete process.env.BISEO_OPENCODE_FREE_LOCK_ERRORS
  }
})
