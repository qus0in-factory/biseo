import assert from 'node:assert/strict'
import test from 'node:test'
import { paneInWorkspace } from '../domain/pane-guard.js'

test('worker pane guard requires the configured workspace prefix', () => {
  assert.equal(paneInWorkspace('w1T', 'w1T:p1'), true)
  assert.equal(paneInWorkspace('w1T', 'w1T:p2'), true)
  assert.equal(paneInWorkspace('w1T', 'w2:p1'), false)
  assert.equal(paneInWorkspace('w1T', 'wx'), false)
  assert.equal(paneInWorkspace('w1T', 'w1T:'), false)
  assert.equal(paneInWorkspace('w1T', '../w1T:p1'), false)
})
