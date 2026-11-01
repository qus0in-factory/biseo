import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageWindowTime } from './UsageWindowTime'
import r from '../resources.json'

const value = {
  window: 'secondary',
  usedPercent: 50,
  resetsAt: '2026-11-01T05:40:03.000Z',
  checkedAt: null,
  limitReached: false,
  source: null,
}

test('usage reset time uses a clock and short KST timestamp', () => {
  const html = renderToStaticMarkup(createElement(UsageWindowTime, { value }))
  assert.match(html, /lucide-clock/)
  assert.match(html, new RegExp(`aria-label="${r.usageReset}"`))
  assert.match(html, new RegExp(`title="${r.usageReset}"`))
  assert.match(html, /26-11-01 14:40:03 \(KST\)/)
  assert.doesNotMatch(html, new RegExp(`>${r.usageReset}:`))
})
