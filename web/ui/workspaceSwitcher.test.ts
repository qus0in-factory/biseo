import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import r from '../resources.json'

test('the main selector names the biseo workspace without a dialog step', () => {
 const html = renderToStaticMarkup(createElement(WorkspaceSwitcher, {
  current: 'w1X', select: async () => null,
 }))
 assert.ok(html.includes(r.workspaceCurrent.replace('{id}', 'w1X')))
 assert.ok(!html.includes('aria-haspopup="dialog"'))
})

test('the selector stays available before the current workspace is known', () => {
 const html = renderToStaticMarkup(createElement(WorkspaceSwitcher, {
  current: null, select: async () => null,
 }))
 assert.ok(html.includes(r.workspaceCurrentUnknown))
})
