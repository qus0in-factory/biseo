import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilityNote } from './availability.js'
import type { Availability } from './timeline.js'

const base: Availability = {
  state: 'limited',
  source: 'codex',
  checkedAt: '2026-10-29T10:00:00.000Z',
  resetsAt: '2026-10-29T11:00:00.000Z',
  reason: 'rate_limit_reached',
  window: 'primary',
}

test('available panes show no availability note', () => {
  assert.equal(availabilityNote(undefined), null)
  assert.equal(availabilityNote({ ...base, state: 'available' }), null)
})

test('limited and unknown panes expose a tooltip note', () => {
  assert.deepEqual(availabilityNote(base), {
    state: 'limited',
    resetsAt: base.resetsAt,
  })
  assert.deepEqual(availabilityNote({ ...base, state: 'unknown', resetsAt: null }), {
    state: 'unknown',
    resetsAt: null,
  })
})
