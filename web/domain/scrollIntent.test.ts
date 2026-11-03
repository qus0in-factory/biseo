import test from 'node:test'
import assert from 'node:assert/strict'
import { scrollAction } from './scrollIntent.js'
import { ownSendAdded } from './scrollIntent.js'
import { scrollItem } from '../test-util/scrollItem-fixture'
test('own send scrolls to bottom even while the user reads history', () => {
  assert.equal(scrollAction(true, false, true), 'bottom')
  assert.equal(scrollAction(true, false, false), 'bottom')
})

test('incoming messages follow only while the user is at the bottom', () => {
  assert.equal(scrollAction(false, true, true), 'bottom')
  assert.equal(scrollAction(false, false, true), 'jump')
  assert.equal(scrollAction(false, false, false), 'none')
})
test('detects a newly added own send', () => {
  assert.equal(ownSendAdded([], [scrollItem('r1', 'queued', true)]), true)
  assert.equal(ownSendAdded([scrollItem('r1', 'queued', true)], [scrollItem('r1', 'queued', true)]), false)
  assert.equal(ownSendAdded([], [scrollItem('r1')]), false)
})
