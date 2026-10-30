import test from 'node:test'
import assert from 'node:assert/strict'
import { parseClaudeUsage } from './claude-oauth-parse.js'

const w = (utilization: number) => ({ utilization, resets_at: '2026-11-06T00:00:00Z' })

test('parses the live oauth shape and keeps every measured window', () => {
  const raw = {
    five_hour: w(37), seven_day: w(12), seven_day_opus: null, seven_day_sonnet: w(5),
    extra_usage: { utilization: 5 }
  }
  const res = parseClaudeUsage(raw, new Date('2026-10-30T10:00:00Z'))
  assert.equal(res.state, 'available')
  assert.equal(res.windows.length, 2)
  assert.deepEqual(res.metrics.map((m) => m.id), ['five_hour', 'seven_day', 'seven_day_sonnet', 'extra_usage'])
  assert.equal(res.metrics[0].remaining, 63)
})

test('empty window objects are unknown, not an empty success', () => {
  const res = parseClaudeUsage({ five_hour: {}, seven_day: {} })
  assert.equal(res.state, 'unknown')
  assert.deepEqual(res.metrics, [])
})
