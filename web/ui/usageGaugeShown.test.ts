import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageGauge } from './UsageGauge'
import r from '../resources.json'

test('gauge width and aria follow the shown number while the tone follows used', () => {
  const html = renderToStaticMarkup(createElement(UsageGauge, {
    used: 95, shown: 5, label: r.usageRemaining, window: '5h',
  }))
  assert.match(html, new RegExp(`aria-label="${r.usageRemaining}"`))
  assert.match(html, /aria-valuenow="5"/)
  assert.match(html, /width:5%/)
  assert.match(html, /bg-warning/)
})
