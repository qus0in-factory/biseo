import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOllamaBalance } from './ollama-balance-parse.js'

test('parseOllamaBalance falls back to the configured included allowance', () => {
  const m = parseOllamaBalance({ included: { balance_usd: 45 }, purchased: { balance_usd: 0 } }, 60)
  assert.equal(m.length, 2)
  assert.equal(m[0].limit, 60)
  assert.equal(m[0].used, 15)
  assert.equal(m[0].remaining, 45)
  assert.equal(m[1].remaining, 0)
  const zero = parseOllamaBalance({ included: { balance_usd: 30, allowance_usd: 0 } }, 60)
  assert.equal(zero[0].limit, 60)
  assert.equal(zero[0].used, 30)
})

test('parseOllamaBalance ignores missing or invalid data', () => {
  assert.deepEqual(parseOllamaBalance(null), [])
  assert.deepEqual(parseOllamaBalance({}), [])
})
