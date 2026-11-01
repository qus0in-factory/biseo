import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneStatusBadge } from './PaneStatusBadge'
import { TurnStatusBadge } from './TurnStatusBadge'
import { statusStyle } from './paneStatusBadgeStyle'

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
