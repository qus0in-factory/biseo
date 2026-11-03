import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { MarkdownResponse } from './MarkdownResponse'
import { describe } from 'node:test'
import assert from 'node:assert/strict'

describe('MarkdownResponse source', () => {
test('markdown response exposes a localized unchecked switch initially', () => {
  const out = renderToStaticMarkup(createElement(MarkdownResponse, { text: 'hello' }))
  assert.match(out, /role="switch"/)
  assert.match(out, /aria-checked="false"/)
  assert.ok(out.includes(`aria-label="${r.markdownToggleLabel}"`))
})

})
