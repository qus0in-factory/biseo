import assert from 'node:assert/strict'
import test from 'node:test'
import { parsePinPreferred } from './pin-preferred.js'

test('only an explicit true enables PIN first', () => {
  assert.equal(parsePinPreferred({ pinPreferred: true }), true)
  for (const v of [null, undefined, {}, { pinPreferred: false }, { pinPreferred: 'true' }, true, []]) {
    assert.equal(parsePinPreferred(v), false)
  }
})
