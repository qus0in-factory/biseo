import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneStatusBadge } from './PaneStatusBadge.js'
import type { PaneStatus } from '../domain/timeline.js'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { TurnStatusBadge } from './TurnStatusBadge'
const cases: [PaneStatus, string, string][] = [
  ['idle', '대기', 'lucide-clock'],
  ['working', '실행 중', 'lucide-loader'],
  ['done', '완료', 'lucide-check'],
  ['blocked', '차단됨', 'lucide-alert-triangle'],
  ['unknown', '알 수 없음', 'lucide-help-circle'],
]

test('status badges render label, icon, and aria per state', () => {
  for (const [s, label, icon] of cases) {
    const h = renderToStaticMarkup(React.createElement(PaneStatusBadge, { status: s }))
    assert.match(h, new RegExp(`aria-label="${label}"`))
    assert.match(h, new RegExp(`>${label}<`))
    assert.match(h, new RegExp(icon))
    assert.match(h, /aria-hidden="true"/)
    assert.equal(h.includes('animate-spin'), s === 'working')
  }
})
const states: PaneStatus[] = ['idle', 'working', 'done', 'blocked', 'unknown']

test('status badge classes are distinct per state', () => {
  const classes = states.map((s) => {
    const h = renderToStaticMarkup(React.createElement(PaneStatusBadge, { status: s }))
    const m = h.match(/class="([^"]*status-[^"]*)"/)
    assert.ok(m, `${s} should render a class attribute`)
    return m![1]
  })
  assert.equal(new Set(classes).size, states.length)
})
test('pane and recorded turn distinguish input from blocked', () => {
  assert.match(render(h(PaneStatusBadge, { status: 'blocked', blockedReason: 'input_request' })), /입력 필요/)
  assert.match(render(h(TurnStatusBadge, { status: 'blocked', errorCode: 'input_request' })), /입력 필요/)
  assert.match(render(h(TurnStatusBadge, { status: 'blocked', errorCode: 'agent_blocked' })), /차단됨/)
})
