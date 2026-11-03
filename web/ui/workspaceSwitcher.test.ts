import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'

test('the main selector shows workspace tabs without a duplicate title', () => {
 const html = renderToStaticMarkup(createElement(WorkspaceSwitcher, {
  current: 'w1X', select: async () => null,
 }))
 assert.match(html, /class="workspace-switcher"/)
 assert.ok(!html.includes('워크스페이스:'))
 assert.ok(!html.includes('aria-haspopup="dialog"'))
})

test('the selector stays available before the current workspace is known', () => {
 const html = renderToStaticMarkup(createElement(WorkspaceSwitcher, {
  current: null, select: async () => null,
 }))
 assert.match(html, /class="workspace-switcher"/)
})
