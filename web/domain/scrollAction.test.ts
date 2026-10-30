import test from 'node:test'
import assert from 'node:assert/strict'
import { scrollAction } from './scrollIntent.js'

test('own send scrolls to bottom even while the user reads history', () => {
  assert.equal(scrollAction(true, false, true), 'bottom')
  assert.equal(scrollAction(true, false, false), 'bottom')
})

test('incoming messages follow only while the user is at the bottom', () => {
  assert.equal(scrollAction(false, true, true), 'bottom')
  assert.equal(scrollAction(false, false, true), 'jump')
  assert.equal(scrollAction(false, false, false), 'none')
})
