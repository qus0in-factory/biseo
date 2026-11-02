import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { PaneStatusSummary } from './PaneStatusSummary'

test('status summary does not repeat the loading text above the list skeleton', () => {
  const out = renderToStaticMarkup(createElement(PaneStatusSummary, {
    panes: [],
    state: { status: 'loading' },
  }))
  assert.equal(out, '')
})
