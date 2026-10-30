import assert from 'node:assert/strict'
import test from 'node:test'
import { parseUsage } from '../app/usage-sync.js'
import { groupUsage } from '../app/usage-group.js'

test('nested metrics preserve unit, id, label, and values', () => {
  const rows = parseUsage({
    providers: [{
      provider: 'agy',
      state: 'limited',
      metrics: [
        { id: 'Claude:weekly', label: 'Claude - Weekly', unit: 'percent', used: 100, limit: 100, remaining: 0 },
        { id: 'balance', label: 'Credits', unit: 'credits', used: null, limit: null, remaining: 50 }
      ]
    }]
  })
  assert.equal(rows.length, 2)
  assert.equal(rows[0].metricId, 'Claude:weekly')
  assert.equal(rows[0].unit, 'percent')
  assert.equal(rows[1].metricId, 'balance')
  assert.equal(rows[1].unit, 'credits')

  const grouped = groupUsage(rows)
  assert.equal(grouped[0].metrics.length, 2)
  assert.equal(grouped[0].metrics[0].label, 'Claude - Weekly')
  assert.equal(grouped[0].metrics[1].remaining, 50)
})
