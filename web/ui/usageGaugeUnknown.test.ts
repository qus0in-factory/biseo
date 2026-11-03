import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageGauge } from './UsageGauge'
import r from '../resources.json'

test('unknown, invalid and stale usage never claim zero percent', () => {
  for (const props of [{ used: null }, { used: NaN }, { used: Infinity }, { used: 50, stale: true }]) {
    const html = renderToStaticMarkup(createElement(UsageGauge, { window: 'w', ...props }))
    assert.doesNotMatch(html, /aria-valuenow/)
    assert.ok(html.includes(`aria-valuetext="${r.usageUnconfirmed}"`))
    assert.match(html, /width:0%/)
  }
})
