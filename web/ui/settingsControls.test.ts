import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneManageOpenForm } from './PaneManageOpenForm'
test('templates come from configuration and busy open controls are locked with spinner', () => {
 const html = renderToStaticMarkup(createElement(PaneManageOpenForm, {
  template: 'agy', name: '', busy: true, setTemplate() {}, setName() {}, onOpen() {},
 }))
 assert.match(html, /value="opencode"/)
 assert.match(html, /value="agy"/)
 assert.doesNotMatch(html, /value="claude"|value="codex"/)
 assert.match(html, /animate-spin/)
 assert.equal((html.match(/disabled=""/g) ?? []).length, 3)
})
