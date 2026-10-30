import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOllamaBalance } from './ollama-balance-parse.js'

test('parseOllamaBalance handles usd balance and period', () => {
  const fixture = {
    included: { balance_usd: 0, allowance_usd: 60, period: { from: '2026-10-01T05:40:03Z', until: '2026-11-01T05:40:03Z' } },
    purchased: { balance_usd: 8.80739 }
  }
  const m = parseOllamaBalance(fixture)
  assert.equal(m.length, 2)
  assert.equal(m[0].id, 'included_balance')
  assert.equal(m[0].unit, 'currency')
  assert.equal(m[0].remaining, 0)
  assert.equal(m[0].limit, 60)
  assert.equal(m[0].used, 60)
  assert.equal(m[0].resetsAt, '2026-11-01T05:40:03Z')
  assert.equal(m[1].id, 'purchased_balance')
  assert.equal(m[1].remaining, 8.80739)
})
