import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import { readFileSync } from 'node:fs'
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
const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('the main selector renders tabs through the shared one-step path', () => {
 const view = src('./WorkspaceSwitcher.tsx')
 const state = src('./useWorkspaceSwitcherState.ts')
 assert.match(view, /WorkspaceTabs/)
 assert.match(state, /useWorkspaceTabChoice\(workspaceApi, select, current, s\)/)
 assert.ok(!view.includes('WorkspacePickerDialog'))
 assert.match(state, /missingWorkspaceNotice/)
})
