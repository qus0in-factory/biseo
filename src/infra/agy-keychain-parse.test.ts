import test from 'node:test'
import assert from 'node:assert/strict'
import { parseAgyKeychainValue } from './agy-keychain-parse.js'

test('a file-shaped keychain value keeps its refresh', () => {
  const hit = parseAgyKeychainValue('{"token":{"access_token":"a","refresh_token":"b"}}')
  assert.equal(hit?.access, 'a')
  assert.equal(hit?.refresh, 'b')
})

test('raw and blank keychain values map to plain tokens', () => {
  assert.equal(parseAgyKeychainValue('t')?.access, 't')
  assert.equal(parseAgyKeychainValue(' '), null)
  assert.equal(parseAgyKeychainValue(null), null)
})
