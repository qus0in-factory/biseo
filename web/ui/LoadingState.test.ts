import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { LoadingState } from './LoadingState'
import assert from 'node:assert/strict'

test('loading variants announce their label and busy state', () => {
  for (const variant of ['list', 'login'] as const) {
    const out = renderToStaticMarkup(createElement(LoadingState, { rows: 2, variant }))
    assert.match(out, /role="status"/)
    assert.match(out, /aria-busy="true"/)
    assert.ok(out.includes(r.loading))
  }
})
