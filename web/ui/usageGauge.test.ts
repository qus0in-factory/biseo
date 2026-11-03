import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageGauge } from './UsageGauge'
import r from '../resources.json'
test('gauge exposes clamped value and semantic threshold colors on a visible track', () => {
  for (const [used, window, color, value] of [[90, '5h', 'warning', 90], [98, 'w', 'warning', 98], [130, 'm', 'danger', 100], [-3, 'w', 'muted-foreground', 0]] as const) {
    const html = renderToStaticMarkup(createElement(UsageGauge, { used, window }))
    assert.match(html, /role="progressbar"/)
    assert.ok(html.includes(`aria-valuenow="${value}"`))
    assert.ok(html.includes(`bg-${color}`))
    assert.ok(html.includes(`width:${value}%`))
    assert.match(html, /h-1\.5 w-full min-w-0 overflow-hidden rounded-full bg-muted/)
  }
})
test('gauge width and aria follow the shown number while the tone follows used', () => {
  const html = renderToStaticMarkup(createElement(UsageGauge, {
    used: 95, shown: 5, label: r.usageRemaining, window: '5h',
  }))
  assert.match(html, new RegExp(`aria-label="${r.usageRemaining}"`))
  assert.match(html, /aria-valuenow="5"/)
  assert.match(html, /width:5%/)
  assert.match(html, /bg-warning/)
})
test('unknown, invalid and stale usage renders no gauge at all', () => {
  for (const props of [{ used: null }, { used: NaN }, { used: Infinity }, { used: 50, stale: true }]) {
    assert.equal(renderToStaticMarkup(createElement(UsageGauge, { window: 'w', ...props })), '')
  }
})
