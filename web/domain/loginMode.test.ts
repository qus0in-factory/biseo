import assert from 'node:assert/strict'
import test from 'node:test'
import { isLoginPending, resolveLoginMode } from './loginMode.js'

test('an available PIN starts first and the forgot link switches this screen', () => {
  assert.equal(resolveLoginMode(true, false), 'pin')
  assert.equal(resolveLoginMode(true, true), 'password')
  assert.equal(resolveLoginMode(false, false), 'password')
  assert.equal(resolveLoginMode(false, true), 'password')
})

test('only an unresolved automatic lookup waits before showing a form', () => {
  assert.equal(isLoginPending(undefined, true, true), true)
  assert.equal(isLoginPending(undefined, true, false), false)
  assert.equal(isLoginPending(undefined, false, true), false)
  assert.equal(isLoginPending(true, true, true), false)
  assert.equal(isLoginPending(false, true, true), false)
  assert.equal(isLoginPending(null, true, true), false)
})
