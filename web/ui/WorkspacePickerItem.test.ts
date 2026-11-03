import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { WorkspacePickerItem } from './WorkspacePickerItem'
import { paneSelectClass } from './paneSelectClass'
import { paneSelectTarget } from './paneSelectClass'
import { readFileSync } from 'node:fs'
import r from '../resources.json'
test('selection changes fill, not ring or border; workspace aria is kept', () => {
 const html = renderToStaticMarkup(createElement(WorkspacePickerItem, {
  workspace: { workspaceId: 'w1' }, selected: true, loading: false, onSelect() {},
 }))
 assert.match(html, /bg-muted/)
 assert.match(html, /aria-current="true"/)
 assert.ok(!html.includes('ring-'))
 assert.match(paneSelectClass(true), /bg-muted/)
 const borders = (active: boolean) => paneSelectClass(active).split(' ').filter(c => c.startsWith('border'))
 assert.deepEqual(borders(true), borders(false))
 assert.match(paneSelectTarget, /focus-visible:outline-2/)
})
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
test('workspace focus and connection have distinct user-facing labels',()=>{
 const render=(selected:boolean)=>renderToStaticMarkup(createElement(WorkspacePickerItem,{
  workspace:{workspaceId:'w1',label:'biseo',focused:true,paneCount:2},
  selected,loading:false,onSelect(){},
 }))
 const html=render(true)
 assert.ok(html.includes(r.workspaceSelected))
 assert.ok(html.includes(r.workspaceFocused))
 assert.notEqual(r.workspaceFocused,r.workspaceSelected)
 assert.equal(r.workspaceFocused,'현재 작업 중')
 assert.equal(r.workspaceSelected,'연결됨')
 assert.doesNotMatch(r.workspaceFocused + r.workspaceSelected,/Herdr|biseo/)
 assert.ok(render(false).includes('<span class="sr-only"> biseo</span>'))
})
