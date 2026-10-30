import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MarkdownToggleTrack } from './MarkdownToggleTrack.js'

const render = (on: boolean) =>
  renderToStaticMarkup(createElement(MarkdownToggleTrack, { on, left: 'L', right: 'R' }))

test('only the selected segment is highlighted with bg-card', () => {
  for (const [on, active, idle] of [[false, 'L', 'R'], [true, 'R', 'L']] as const) {
    const html = render(on)
    assert.equal((html.match(/bg-card/g) ?? []).length, 1)
    assert.match(html, new RegExp(`bg-card[^>]*>${active}<`))
    assert.match(html, new RegExp(`bg-surface[^>]*>${idle}<`))
  }
})

test('a caller can widen the track for text labels', () => {
  const html = renderToStaticMarkup(
    createElement(MarkdownToggleTrack, { on: false, left: 'L', right: 'R', className: 'w-auto min-w-20' }),
  )
  assert.match(html, /h-7 w-auto min-w-20/)
})
