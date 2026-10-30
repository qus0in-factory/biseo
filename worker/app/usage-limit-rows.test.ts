import test from 'node:test'
import assert from 'node:assert/strict'
import { parseUsage } from './usage-sync.js'

test('only the exhausted row is flagged when the provider is limited', () => {
  const rows = parseUsage({
    providers: [{
      provider: 'agy',
      state: 'limited',
      metrics: [
        { id: 'gemini:Gemini Models:gemini-weekly', unit: 'percent', used: 100, limit: 100, remaining: 0 },
        { id: 'gemini:Gemini Models:gemini-5h', unit: 'percent', used: 0, limit: 100, remaining: 100 }
      ]
    }]
  })
  assert.equal(rows.length, 2)
  assert.deepEqual(rows.map((r) => r.limitReached), [true, false])
})
