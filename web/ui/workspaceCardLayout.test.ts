import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { WorkspacePickerItem } from './WorkspacePickerItem'
test('workspace name ellipsized and metadata wraps below', () => {
 const html = renderToStaticMarkup(createElement(WorkspacePickerItem, {
  workspace: { workspaceId: 'w1', label: 'Factory Production Coordination Workspace', focused: true, paneCount: 8 },
  selected: false, loading: false, onSelect() {},
 }))
 assert.match(html, /class="workspace-head"/)
 assert.match(html, /class="workspace-name" title="Factory Production Coordination Workspace"/)
 assert.match(html, /class="workspace-meta"/)
 const css = readFileSync(new URL('./workspace-picker.css', import.meta.url), 'utf8')
 assert.match(css, /\.workspace-name \{[^}]*text-overflow: ellipsis;[^}]*white-space: nowrap;/)
 assert.match(css, /\.workspace-meta \{[^}]*flex-wrap: wrap;/)
})
