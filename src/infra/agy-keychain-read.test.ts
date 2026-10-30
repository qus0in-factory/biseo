import test from 'node:test'
import assert from 'node:assert/strict'
import { readAgyKeychain } from './agy-keychain-read.js'
import { loadStoredAgyToken } from './agy-token-source.js'

const shaped = '{"token":{"access_token":"a","refresh_token":"b"}}'

test('a readable keychain returns the stored value', async () => {
  const v = await readAgyKeychain(async () => shaped)
  assert.equal(v, shaped)
})

test('a failing keychain quiets to null', async () => {
  const v = await readAgyKeychain(async () => { throw new Error('deny') })
  assert.equal(v, null)
})

test('a keychain hit wins over the file', async () => {
  process.env.BISEO_AGY_TOKEN_PATH = '/definitely/missing-agy129'
  const s = await loadStoredAgyToken(async () => shaped)
  assert.equal(s.keychain?.refresh, 'b')
  assert.equal(s.file, null)
})
