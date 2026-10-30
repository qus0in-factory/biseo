import test from 'node:test'
import assert from 'node:assert/strict'
import { ownSendAdded } from './scrollIntent.js'
import { scrollItem } from './scrollItem-fixture.js'

test('detects a newly added own send', () => {
  assert.equal(ownSendAdded([], [scrollItem('r1', 'queued', true)]), true)
  assert.equal(ownSendAdded([scrollItem('r1', 'queued', true)], [scrollItem('r1', 'queued', true)]), false)
  assert.equal(ownSendAdded([], [scrollItem('r1')]), false)
})
