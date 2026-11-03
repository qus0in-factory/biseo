import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageGauge } from './UsageGauge'

test('gauge exposes clamped consumption and semantic threshold colors at 4px', () => {
  for (const [used, window, color, value] of [[90, '5h', 'warning', 90], [98, 'w', 'warning', 98], [130, 'm', 'danger', 100], [-3, 'w', 'muted-foreground', 0]] as const) {
    const html = renderToStaticMarkup(createElement(UsageGauge, { used, window }))
    assert.match(html, /role="progressbar"/)
    assert.ok(html.includes(`aria-valuenow="${value}"`))
    assert.ok(html.includes(`bg-${color}`))
    assert.ok(html.includes(`width:${value}%`))
    assert.match(html, /col-span-3 h-1 min-w-0 overflow-hidden/)
  }
})
