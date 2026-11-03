import assert from 'node:assert/strict'
import test from 'node:test'
import { isValidPin } from '../domain/pin-value.js'

test('PIN must be exactly six digits', () => {
  assert.ok(isValidPin('123456'))
  for (const v of ['12345', '1234567', '12345a', '', 123456, null]) {
    assert.ok(!isValidPin(v), String(v))
  }
})
