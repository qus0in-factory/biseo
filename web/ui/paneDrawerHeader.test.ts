import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneDrawerHeader } from './PaneDrawerHeader'

test('compact controls align to the same start edge as pane initials', () => {
 const render = (open: boolean) => renderToStaticMarkup(
  createElement(PaneDrawerHeader, { open, onToggle() {} }),
 )
 assert.match(render(false), /^<div class="flex gap-2 items-start flex-col">/)
 assert.match(render(true), /^<div class="flex gap-2 items-center justify-between">/)
})
