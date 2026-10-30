import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MarkdownToggle } from './MarkdownToggle.js'
import { MarkdownToggleTrack } from './MarkdownToggleTrack.js'

test('toggle keeps a compact segmented control inside a 44px padded target', () => {
  const html = renderToStaticMarkup(createElement(MarkdownToggle, { raw: true, onToggle: () => {} }))
  assert.match(html, /class="[^"]*h-11 w-20[^"]*p-2/)
  assert.match(html, /aria-hidden="true" class="[^"]*h-7 w-16/)
})

test('a caller can widen the track for text labels', () => {
  const html = renderToStaticMarkup(
    createElement(MarkdownToggleTrack, { on: false, left: 'L', right: 'R', className: 'w-auto min-w-20' }),
  )
  assert.match(html, /h-7 w-auto min-w-20/)
})
