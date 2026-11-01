import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { statusAccentColor, statusStyle } from '../ui/paneStatusBadgeStyle.js'

const statuses = ['idle', 'working', 'done', 'blocked'] as const

test('summary accent colors reuse the pane badge color tokens', () => {
  for (const status of statuses) {
    const badge = statusStyle(status)
    const badgeColor = status === 'idle' ? badge.color : badge.background
    assert.equal(statusAccentColor(status), badgeColor, status)
  }
})

test('summary reuses shared badge tokens instead of copying color values', () => {
  const sources = ['PaneStatusSummary.tsx', 'PaneStatusSummaryItem.tsx'].map((file) =>
    readFileSync(new URL(`../ui/${file}`, import.meta.url), 'utf8'),
  )
  for (const src of sources) assert.doesNotMatch(src, /#[0-9a-f]{6}|var\(--status-/i)
  assert.match(sources[0], /PaneStatusSummaryItem/)
  assert.match(sources[1], /statusAccentColor/)
})
