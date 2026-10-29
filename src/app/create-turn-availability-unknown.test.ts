import test from 'node:test'
import assert from 'node:assert/strict'
import { createTurn } from './create-turn.js'
import { input, reader } from './turn-data-fixture.js'
import { makeDeps } from './turn-fixture.js'
import { limited } from './create-turn-availability-fixture.js'

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
