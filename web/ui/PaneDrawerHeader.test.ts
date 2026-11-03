import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { PaneDrawerHeader } from './PaneDrawerHeader'
import assert from 'node:assert/strict'

test('drawer header shows its title only when expanded', () => {
  const render = (open: boolean) => renderToStaticMarkup(createElement(PaneDrawerHeader, { open, onToggle() {} }))
  assert.ok(render(true).includes(`<h2`))
  assert.ok(render(true).includes(r.panesTitle))
  assert.doesNotMatch(render(false), /<h2/)
  assert.match(render(true), /aria-expanded="true"/)
  assert.match(render(false), /aria-expanded="false"/)
})
