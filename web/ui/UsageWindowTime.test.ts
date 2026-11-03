import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageWindowTime } from './UsageWindowTime'
import { percentValue } from '../test-util/usageRowAssert'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageModalDisplay } from './UsageModalDisplay'
import r from '../resources.json'

const at = '2026-11-03T00:17:00Z'

test('modal reset prioritizes relative time while retaining absolute tooltip', () => {
  const original = Date.now
  Date.now = () => Date.parse('2026-11-03T00:00:00Z')
  try {
    const value = percentValue(at)
    const html = render(h(UsageModalDisplay, { value: true }, h(UsageWindowTime, { value })))
    assert.match(html, /17분 후/)
    assert.match(html, /title="2026-11-03 09:17:00"/)
    assert.doesNotMatch(html, />26-11-03 09:17:00</)
  } finally { Date.now = original }
})
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
  assert.match(html, /<button[^>]*aria-expanded="false"/)
  assert.match(html, /26-11-01 14:40:03/)
  assert.doesNotMatch(html, /\(KST\)/)
  assert.doesNotMatch(html, new RegExp(`>${r.usageReset}:`))
})
test('window timestamps retain full titles and chronological display order', () => {
  const value = { ...percentValue('2026-11-01T05:40:03Z'), checkedAt: '2026-11-01T05:45:00Z' }
  const out = renderToStaticMarkup(createElement(UsageWindowTime, { value }))
  assert.match(out, /title="2026-11-01 14:40:03"/)
  assert.match(out, /title="2026-11-01 14:45:00"/)
  assert.ok(out.indexOf('26-11-01 14:40:03') < out.indexOf('26-11-01 14:45:00'))
})
