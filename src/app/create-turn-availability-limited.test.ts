import test from 'node:test'
import assert from 'node:assert/strict'
import { createTurn } from './create-turn.js'
import { input, reader } from './turn-data-fixture.js'
import { makeDeps } from './turn-fixture.js'
import { limited, resetsAt } from './create-turn-availability-fixture.js'

test('a limited provider rejects send before capture and lock', async () => {
  const d = makeDeps(reader)
  let begins = 0
  d.capture.begin = async () => {
    begins++
    return reader
  }
  d.availability = { get: async () => limited }
  const r = await createTurn(d, input)
  assert.equal(r.ok, false)
  if (!r.ok) {
    assert.equal(r.status, 409)
    assert.equal(r.reason, 'provider_rate_limited')
    assert.equal(r.resetsAt, resetsAt)
  }
  assert.equal(begins, 0)
  assert.equal(d.locks.has('w:p1'), false)
  assert.equal(d.store.get('r1'), undefined)
})
