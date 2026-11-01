import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOllamaBalance } from './ollama-balance-parse.js'

test('missing allowance is unknown, never a configured guess', () => {
  const [m] = parseOllamaBalance({ included: { balance_usd: 5 } })
  assert.equal(m.limit, null)
  assert.equal(m.used, null)
  assert.equal(parseOllamaBalance({ included: { balance_usd: 0, allowance_usd: 0 } })[0].limit, 0)
  assert.deepEqual(parseOllamaBalance(null), [])
})
