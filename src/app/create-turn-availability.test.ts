import test from 'node:test'
import assert from 'node:assert/strict'
import { createTurn } from './create-turn.js'
import { input, reader } from './turn-fixture-data.test.js'
import { makeDeps } from './turn-fixture.test.js'
import type { Availability } from '../domain/timeline.js'

const resetsAt = new Date(Date.now() + 60000).toISOString()
const limited: Availability = {
  state: 'limited',
  source: 'codex',
  checkedAt: '2026-10-29T10:00:00.000Z',
  resetsAt,
  reason: 'rate_limit_reached',
  window: 'primary',
}

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

test('unknown availability does not block a send', async () => {
  const d = makeDeps(reader)
  d.availability = {
    get: async () => ({
      ...limited,
      state: 'unknown',
      resetsAt: null,
      reason: null,
      window: null,
      source: null,
    }),
  }
  const r = await createTurn(d, input)
  assert.equal(r.ok, true)
  if (r.ok) assert.equal(r.reader, reader)
})
