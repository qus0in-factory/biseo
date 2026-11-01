import assert from 'node:assert/strict'
import test from 'node:test'
import { shouldApplyPaneResponse } from './paneReloadGuard.js'
test('only matching generation applies', () => {
  assert.equal(shouldApplyPaneResponse(1, 1), true)
  assert.equal(shouldApplyPaneResponse(1, 2), false)
})
