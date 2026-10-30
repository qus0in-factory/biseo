import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MarkdownToggle } from './MarkdownToggle.js'

test('toggle keeps a compact segmented control inside a 44px padded target', () => {
  const html = renderToStaticMarkup(createElement(MarkdownToggle, { raw: true, onToggle: () => {} }))
  assert.match(html, /class="[^"]*h-11 w-20[^"]*p-2/)
  assert.match(html, /aria-hidden="true" class="[^"]*h-7 w-16/)
})
