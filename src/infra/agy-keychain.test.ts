import test from 'node:test'
import assert from 'node:assert/strict'
import { agyKeychainConfig } from './agy-keychain-config.js'
import { readAgyKeychain } from './agy-keychain-read.js'

test('service and account come from settings', () => {
  process.env.BISEO_AGY_KEYCHAIN_SERVICE = 'svc'
  process.env.BISEO_AGY_KEYCHAIN_ACCOUNT = 'acct'
  const c = agyKeychainConfig()
  assert.deepEqual([c.service, c.account], ['svc', 'acct'])
  delete process.env.BISEO_AGY_KEYCHAIN_SERVICE
  delete process.env.BISEO_AGY_KEYCHAIN_ACCOUNT
})

test('a disabled keychain never shells out', async () => {
  process.env.BISEO_AGY_KEYCHAIN_ENABLED = '0'
  assert.equal(await readAgyKeychain(), null)
  delete process.env.BISEO_AGY_KEYCHAIN_ENABLED
})
