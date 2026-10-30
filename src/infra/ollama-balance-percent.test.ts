import test from 'node:test'
import assert from 'node:assert/strict'
import { balancePercent } from './ollama-balance-percent.js'

test('balancePercent reports included allowance usage', () => {
  assert.equal(balancePercent(45, 60), 75)
  assert.equal(balancePercent(0, 60), 0)
  assert.equal(balancePercent(60, 60), 100)
  assert.equal(balancePercent(75, 60), 100)
  assert.equal(balancePercent(null, 60), null)
  assert.equal(balancePercent(10, 0), null)
})
