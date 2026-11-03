import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageWindowTime } from './UsageWindowTime'
import { percentValue } from './usageRowAssert.test-util'

test('reset and checked timestamps stack right with full titles', () => {
  const value = { ...percentValue('2026-11-01T05:40:03Z'), checkedAt: '2026-11-01T05:45:00Z' }
  const html = renderToStaticMarkup(createElement(UsageWindowTime, { value }))
  assert.match(html, /flex flex-col items-end gap-0\.5 text-\[11px\] leading-4 tabular-nums/)
  assert.match(html, /title="2026-11-01 14:40:03"/)
  assert.match(html, /title="2026-11-01 14:45:00"/)
  assert.ok(html.indexOf('26-11-01 14:40:03') < html.indexOf('26-11-01 14:45:00'))
})
