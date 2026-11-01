import test from 'node:test'
import assert from 'node:assert/strict'
import { connectionStatus } from './connectionStatus'

test('connection stays connecting until the first successful open', () => {
  assert.equal(connectionStatus(false, false), 'connecting')
  assert.equal(connectionStatus(true, false), 'connected')
})

test('only a dropped connection after success is disconnected', () => {
  assert.equal(connectionStatus(false, true), 'disconnected')
  assert.equal(connectionStatus(true, true), 'connected')
})
