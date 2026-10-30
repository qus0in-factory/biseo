import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { toggleSegmentStyle } from './toggleSegmentStyle.js'
import { MarkdownToggleTrack } from './MarkdownToggleTrack.js'

const sel = toggleSegmentStyle(true).split(' ')[0]
const unsel = toggleSegmentStyle(false).split(' ')[0]

test('only the selected segment uses the shared highlight', () => {
  assert.notEqual(toggleSegmentStyle(true), toggleSegmentStyle(false))
  for (const [on, active, idle] of [[false, 'L', 'R'], [true, 'R', 'L']] as const) {
    const html = renderToStaticMarkup(createElement(MarkdownToggleTrack, { on, left: 'L', right: 'R' }))
    assert.equal(html.split(sel).length - 1, 1)
    assert.match(html, new RegExp(`${sel}[^>]*>${active}<`))
    assert.match(html, new RegExp(`${unsel}[^>]*>${idle}<`))
  }
})
