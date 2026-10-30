import test from 'node:test'
import assert from 'node:assert/strict'
import { parseClaudeUsage } from './claude-oauth-parse.js'

test('parseClaudeUsage marks limited on any limit reached', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const raw = {
    five_hour: { utilization: 20, resets_at: '2026-10-30T15:00:00Z' },
    seven_day_opus: { utilization: 100, resets_at: '2026-11-06T00:00:00Z' }
  }
  const res = parseClaudeUsage(raw, now)
  assert.equal(res.state, 'limited')
})

test('parseClaudeUsage missing', () => {
  assert.equal(parseClaudeUsage(null).state, 'unknown')
})
