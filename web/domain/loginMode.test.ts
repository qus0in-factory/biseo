import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveLoginMode } from './loginMode.js'

test('an available PIN starts first and the forgot link switches this screen', () => {
  assert.equal(resolveLoginMode(true, false), 'pin')
  assert.equal(resolveLoginMode(true, true), 'password')
  assert.equal(resolveLoginMode(false, false), 'password')
  assert.equal(resolveLoginMode(false, true), 'password')
})
