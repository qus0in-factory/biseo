import assert from 'node:assert/strict'
import test from 'node:test'
import { parseClientIp } from '../domain/client-ip.js'
import { isValidPin } from '../domain/pin-value.js'

test('accepts only a single public IP literal', () => {
  assert.equal(parseClientIp('203.0.113.7'), '203.0.113.7')
  assert.equal(parseClientIp('2001:0db8::1'), '2001:db8::1')
  for (const v of [
    '',
    '10.0.0.1',
    '127.0.0.1',
    '192.168.0.1',
    '::1',
    'fe80::1',
    '203.0.113.7, 1.2.3.4',
    '203.0.113.7:443',
    '01.2.3.4',
    ' 203.0.113.7',
  ]) {
    assert.equal(parseClientIp(v), null, v)
  }
})

test('PIN must be exactly six digits', () => {
  assert.ok(isValidPin('123456'))
  for (const v of ['12345', '1234567', '12345a', '', 123456, null]) {
    assert.ok(!isValidPin(v), String(v))
  }
})
