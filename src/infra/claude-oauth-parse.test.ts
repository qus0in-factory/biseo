import test from 'node:test'
import assert from 'node:assert/strict'
import { parseClaudeUsage } from './claude-oauth-parse.js'

test('parseClaudeUsage normal windows', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const raw = {
    five_hour: { utilization: 15, resets_at: '2026-10-30T15:00:00Z' },
    seven_day: { utilization: 40, resets_at: '2026-11-06T00:00:00Z' }
  }
  const res = parseClaudeUsage(raw, now)
  assert.equal(res.state, 'available')
  assert.equal(res.windows[0].usedPercent, 15)
  assert.equal(res.windows[1].usedPercent, 40)
})

test('parseClaudeUsage limited', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const raw = {
    five_hour: { utilization: 100, resets_at: '2026-10-30T15:00:00Z' }
  }
  const res = parseClaudeUsage(raw, now)
  assert.equal(res.state, 'limited')
})

test('parseClaudeUsage missing', () => {
  assert.equal(parseClaudeUsage(null).state, 'unknown')
})
