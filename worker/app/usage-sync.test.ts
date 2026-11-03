import assert from 'node:assert/strict'
import test from 'node:test'
import { parseUsage } from './usage-sync.js'
import { groupUsage } from './usage-group.js'

test('an empty unknown provider keeps reason without default', () => {
  const rows = parseUsage({ providers: [{ provider: 'agy', state: 'unknown', metrics: [], windows: [], reason: 'agy_auth_expired' }] })
  assert.equal(rows.length, 1)
  assert.notEqual(rows[0].metricId, 'default')
  assert.equal(rows[0].reason, 'agy_auth_expired')
  const grouped = groupUsage(rows)
  assert.equal(grouped[0].metrics.length, 0)
  assert.equal(grouped[0].windows.length, 1)
  assert.equal(grouped[0].windows[0].window,'status')
  assert.equal(grouped[0].reason, 'agy_auth_expired')
})

test('an empty provider without a reason still avoids default', () => {
  const rows = parseUsage({ providers: [{ provider: 'codex', state: 'unknown' }] })
  assert.equal(rows.length, 1)
  assert.notEqual(rows[0].metricId, 'default')
  assert.equal(rows[0].reason, null)
})

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

test('flat provider rows keep both windows and missing percent stays null', () => {
  const rows = parseUsage({ providers: [
    { provider: 'codex', state: 'available', window: 'primary', usedPercent: 20 },
    { provider: 'codex', state: 'available', window: 'secondary', usedPercent: null },
  ] })
  assert.equal(rows.length, 2)
  assert.equal(rows[1].usedPercent, null)
  assert.equal(groupUsage(rows)[0].windows.length, 2)
})

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

test('nested windows preserve primary 20 and secondary 90', () => {
  const rows = parseUsage({ providers: [{ provider: 'codex', state: 'limited', windows: [
    { window: 'primary', usedPercent: 20 }, { window: 'secondary', usedPercent: 90 },
  ] }] })
  assert.deepEqual(rows.map((r) => [r.window, r.usedPercent]), [['primary', 20], ['secondary', 90]])
  assert.deepEqual(groupUsage(rows)[0].windows.map((w) => w.window), ['primary', 'secondary'])
})

test('a window start survives grouping for exact progress', () => {
  const rows = parseUsage({
    providers: [{
      provider: 'codex',
      state: 'available',
      windows: [{ window: 'secondary', usedPercent: 50, startsAt: '2026-10-25T00:00:00Z' }],
    }],
  })
  assert.equal(groupUsage(rows)[0].windows[0].startsAt, '2026-10-25T00:00:00Z')
})
