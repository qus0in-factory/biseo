import test from 'node:test'
import assert from 'node:assert/strict'
import config from '../../config/session.json'
import { loadPinPreference } from './pinPreference.js'

test('a resolved PIN preference is kept', async () => {
  assert.equal(await loadPinPreference(async () => true, 50), true)
})

test('a failed lookup falls back to the password screen', async () => {
  assert.equal(await loadPinPreference(async () => { throw new Error('down') }, 50), false)
})

test('a hung lookup is cut off by the configured timeout', async () => {
  const hung = (signal: AbortSignal) => new Promise<boolean>((_, reject) => {
    signal.addEventListener('abort', () => reject(new Error('aborted')))
  })
  assert.equal(await loadPinPreference(hung, 20), false)
})

test('the timeout is a positive configuration value', () => {
  assert.ok(Number.isFinite(config.pinPreferredTimeoutMs))
  assert.ok(config.pinPreferredTimeoutMs > 0 && config.pinPreferredTimeoutMs <= 5000)
})
