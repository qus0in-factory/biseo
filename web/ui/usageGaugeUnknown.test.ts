import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageGauge } from './UsageGauge'

test('unknown, invalid and stale usage renders no gauge at all', () => {
  for (const props of [{ used: null }, { used: NaN }, { used: Infinity }, { used: 50, stale: true }]) {
    assert.equal(renderToStaticMarkup(createElement(UsageGauge, { window: 'w', ...props })), '')
  }
})
