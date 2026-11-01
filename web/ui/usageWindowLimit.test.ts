import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageWindowRow } from './UsageWindowRow.js'

test('explicit window limit has a non-color label', () => {
  const value = { window: 'primary', usedPercent: null, resetsAt: null,
    checkedAt: null, limitReached: true, source: null }
  const html = renderToStaticMarkup(createElement(UsageWindowRow, { provider: 'test', value }))
  assert.match(html, /text-error/)
  assert.match(html, /sr-only[^>]*>한도 도달/)
})
