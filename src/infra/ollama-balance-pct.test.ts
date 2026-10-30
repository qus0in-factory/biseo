import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOllamaBalance } from './ollama-balance-parse.js'

test('parseOllamaBalance handles legacy session and weekly pct', () => {
  const fixture = {
    included: {
      session: { remaining_percent: 75, resets_at: '2026-10-30T16:00:00Z' },
      weekly: { remaining_percent: 50, resets_at: '2026-11-05T00:00:00Z' }
    }
  }
  const m = parseOllamaBalance(fixture)
  assert.equal(m.length, 2)
  assert.equal(m[0].id, 'session')
  assert.equal(m[0].unit, 'percent')
  assert.equal(m[0].remaining, 75)
  assert.equal(m[0].used, 25)
  assert.equal(m[1].id, 'weekly')
  assert.equal(m[1].remaining, 50)
})

test('parseOllamaBalance handles empty or missing', () => {
  assert.deepEqual(parseOllamaBalance(null), [])
  assert.deepEqual(parseOllamaBalance({}), [])
})
