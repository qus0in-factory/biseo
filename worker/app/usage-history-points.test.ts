import test from 'node:test'
import assert from 'node:assert/strict'
import { historyPoints } from './usage-history-points.js'
import { parseUsage } from './usage-sync.js'

test('history pairs known windows, rejecting unknown, ambiguous and missing windows', () => {
  const metric = (id: string, used: number | null) =>
    ({ id, used, unit: 'percent', resetsAt: '2030-01-01T00:00:00Z' })
  const rows = (metrics: unknown[]) => parseUsage({ providers: [
    { provider: 'claude', state: 'available', metrics },
  ] })
  const pair = [metric('five_hour', 20), metric('seven_day', 5)]
  assert.equal(historyPoints(rows(pair), 1).length, 1)
  assert.equal(historyPoints(rows([pair[0]]), 1).length, 0)
  assert.equal(historyPoints(rows([...pair, metric('5h', 30)]), 1).length, 0)
  assert.equal(historyPoints(rows([pair[0], metric('seven_day', null)]), 1).length, 0)
})
