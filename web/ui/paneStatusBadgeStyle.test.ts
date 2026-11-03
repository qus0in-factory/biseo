import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { statusAccentColor } from './paneStatusBadgeStyle.js'
import { statusStyle } from './paneStatusBadgeStyle.js'
import { createElement } from 'react'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneStatusBadge } from './PaneStatusBadge'
import { TurnStatusBadge } from './TurnStatusBadge'
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
    readFileSync(new URL(`../ui/${file}`, new URL("../app/paneStatusSummaryTokens.test.ts", import.meta.url).href), 'utf8'),
  )
  for (const src of sources) assert.doesNotMatch(src, /#[0-9a-f]{6}|var\(--status-/i)
  assert.match(sources[0], /PaneStatusSummaryItem/)
  assert.match(sources[1], /statusAccentColor/)
})
test('input uses warning fill and Off White text, distinct from working', () => {
  assert.deepEqual(statusStyle('input_required'), {
    background: 'var(--color-warning)', color: 'var(--color-canvas)',
    border: '1px solid var(--color-warning)',
  })
  assert.equal(statusAccentColor('input_required'), 'var(--color-warning)')
  assert.notDeepEqual(statusStyle('input_required'), statusStyle('working'))
})
const html = (node: ReactElement) => renderToStaticMarkup(node)

test('timeline badges use the pane badge colors and weight', () => {
  for (const status of ['done', 'idle'] as const) {
    const p = html(createElement(PaneStatusBadge, { status }))
    const t = html(createElement(TurnStatusBadge, { status: status === 'done' ? 'completed' : 'queued' }))
    const { background, color } = statusStyle(status)
    for (const out of [p, t]) {
      assert.ok(out.includes(`background:${background}`), out)
      assert.ok(out.includes(`color:${color}`), out)
      assert.match(out, /font-semibold/)
    }
  }
})
