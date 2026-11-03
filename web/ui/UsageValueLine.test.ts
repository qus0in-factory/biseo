import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageValueLine } from './UsageValueLine'
import { UsageValueStatus } from './UsageValueStatus'
import assert from 'node:assert/strict'

test('long usage labels and values retain their full title text', () => {
  const text = '$12345678901234567890'
  const value = createElement(UsageValueStatus, { text, used: null, window: 'unknown' })
  const out = renderToStaticMarkup(createElement(UsageValueLine, { label: text, value }))
  assert.equal((out.match(/title="\$12345678901234567890"/g) ?? []).length, 2)
})
