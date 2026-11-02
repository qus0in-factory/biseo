import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneSelectButton } from './PaneSelectButton'
import { makeTestPane } from '../domain/pane-usage-test-helper'

test('selection and hint buttons are siblings, not nested controls', () => {
  const html = renderToStaticMarkup(createElement(PaneSelectButton, {
    item: makeTestPane('codex', 'sol'), active: true, onClick() {},
  }))
  assert.match(html, /<button[^>]*aria-pressed="true"[^>]*><\/button>/)
  assert.match(html, /<button[^>]*aria-expanded="false"/)
  assert.doesNotMatch(html, /<button[^>]*>(?:(?!<\/button>)[\s\S])*<button/)
})
