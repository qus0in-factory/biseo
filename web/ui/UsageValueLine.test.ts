import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageValueLine } from './UsageValueLine'
import { UsageValueStatus } from './UsageValueStatus'

test('long labels and values cannot grow fixed grid tracks', () => {
  const text = '$12345678901234567890'
  const value = createElement(UsageValueStatus, { text, used: null, window: 'unknown' })
  const html = renderToStaticMarkup(createElement(UsageValueLine, { label: text, value }))
  assert.match(html, /grid min-w-0 grid-cols-\[minmax\(0,1fr\)_4\.25rem_4\.75rem\]/)
  assert.equal((html.match(/title="\$12345678901234567890"/g) ?? []).length, 2)
  assert.match(html, /min-w-0 truncate text-right/)
  assert.match(html, /inline-flex max-w-full/)
})
