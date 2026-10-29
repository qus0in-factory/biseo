import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneStatusBadge } from '../ui/PaneStatusBadge.js'

const cases = [
  ['idle', '대기', 'lucide-clock'],
  ['working', '실행 중', 'lucide-loader'],
  ['done', '완료', 'lucide-check'],
  ['blocked', '차단됨', 'lucide-alert-triangle'],
  ['unknown', '알 수 없음', 'lucide-help-circle'],
] as const

test('status badges render label, icon, and aria per state', () => {
  for (const [s, label, icon] of cases) {
    const h = renderToStaticMarkup(
      React.createElement(PaneStatusBadge, { status: s }),
    )
    assert.match(h, new RegExp(`class="pane-badge status-${s}"`))
    assert.match(h, new RegExp(`aria-label="${label}"`))
    assert.match(h, new RegExp(`>${label}<`))
    assert.match(h, new RegExp(icon))
    assert.match(h, /aria-hidden="true"/)
    assert.equal(h.includes('spin'), s === 'working')
  }
})
