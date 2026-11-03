import assert from 'node:assert/strict'
import test from 'node:test'
import { belongsToWorkspace } from './streamWorkspace.js'

test('accepts events for the active workspace', () => {
  assert.equal(belongsToWorkspace('w1', 'w1'), true)
})

test('rejects late events from a previous workspace', () => {
  assert.equal(belongsToWorkspace('w2', 'w1'), false)
  assert.equal(belongsToWorkspace(null, 'w1'), false)
})
