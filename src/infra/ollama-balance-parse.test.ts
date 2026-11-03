import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOllamaBalance } from './ollama-balance-parse.js'

{

test('missing allowance is unknown, never a configured guess', () => {
  const [m] = parseOllamaBalance({ included: { balance_usd: 5 } })
  assert.equal(m.limit, null)
  assert.equal(m.used, null)
  assert.equal(parseOllamaBalance({ included: { balance_usd: 0, allowance_usd: 0 } })[0].limit, 0)
  assert.deepEqual(parseOllamaBalance(null), [])
})
}
{

test('parseOllamaBalance keeps only included and purchased balances', () => {
  const fixture = {
    included: { balance_usd: 15, allowance_usd: 60, period: { from: '2026-10-01T05:40:03Z', until: '2026-11-01T05:40:03Z' } },
    purchased: { balance_usd: 8.8 },
    session: { remaining_percent: 25 },
    weekly: { remaining_percent: 50 }
  }
  const m = parseOllamaBalance(fixture)
  assert.equal(m.length, 2)
  assert.equal(m[0].id, 'included_balance')
  assert.equal(m[0].unit, 'currency')
  assert.equal(m[0].used, 45)
  assert.equal(m[0].limit, 60)
  assert.equal(m[0].remaining, 15)
  assert.equal(m[0].resetsAt, '2026-11-01T05:40:03Z')
  assert.equal(m[0].startsAt, '2026-10-01T05:40:03Z')
  assert.equal(m[1].id, 'purchased_balance')
  assert.equal(m[1].remaining, 8.8)
  assert.deepEqual(m.map((x) => x.id), ['included_balance', 'purchased_balance'])
})
}
